import express from 'express';
import bodyParser from 'body-parser';
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// Paths for storing OAuth credentials and tokens
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let firstEmailThread = ''; // Store the fetched email thread temporarily

async function authorize(callback) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect_uris[0]
    );

    try {
      const token = await fs.readFile(TOKEN_PATH);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    } catch (err) {
      await getNewToken(oAuth2Client, callback);
    }
  } catch (err) {
    console.error('Error loading credentials:', err);
  }
}

async function getNewToken(oAuth2Client, callback) {
  // OAuth flow logic here
}

function listThreads(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.threads.list(
    {
      userId: 'me',
      maxResults: 1,
      labelIds: ['INBOX'],
    },
    (err, res) => {
      if (err) return console.error('Error fetching threads:', err);
      console.log('Threads fetched:', res); // Log response to check thread data
      const threads = res.data.threads;
      if (!threads || threads.length === 0) {
        console.log('No threads found.');
        return;
      }
      const threadId = threads[0].id;
      getThreadContent(auth, threadId);
    }
  );
}

function getThreadContent(auth, threadId) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.threads.get(
    {
      userId: 'me',
      id: threadId,
    },
    (err, res) => {
      if (err) return console.error('Error fetching thread content:', err);
      const messages = res.data.messages;

      let threadContent = '';
      messages.forEach((message) => {
        const payload = message.payload;
        const parts = payload.parts || [];
        parts.forEach((part) => {
          if (part.mimeType === 'text/plain' && part.body.data) {
            const decodedBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
            threadContent += decodedBody + '\n\n';
          }
        });
      });

      firstEmailThread = threadContent; // Store the thread content
      console.log('Fetched Thread:', firstEmailThread); // Log to check the content
    }
  );
}

async function summarizeThread(threadContent) {
  try {
    // Refine the prompt to make OpenAI focus on summarizing the email, not just echoing it.
    const prompt = `
    Please summarize the following email thread. Extract key points, requests, and actions in a concise summary. Do not just repeat the email content.

    This should be the format. Summary of the email thread. Followed by the tasks required to be completed by all parties. Followed by any deadlines mentioned.

    Summary:
    `;

    console.log('Sending to OpenAI:', prompt); // Log to verify prompt content

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing thread:', error);
    throw error;
  }
}

// Endpoint to fetch the first email thread
app.get('/emails', (req, res) => {
  if (firstEmailThread) {
    res.json({ thread: firstEmailThread });
  } else {
    console.log('First email thread is not populated yet.');
    res.status(500).json({ error: 'Email thread not fetched yet.' });
  }
});

// Endpoint to summarize an email thread
app.post('/emails/summarize', async (req, res) => {
  const { threadContent } = req.body;
  try {
    const summary = await summarizeThread(threadContent);
    console.log('Generated Summary:', summary); // Log the summary before sending to frontend
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  authorize(listThreads); // Fetch the email thread on server start
});
