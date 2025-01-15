import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv'

dotenv.config();

// Paths for storing OAuth credentials and tokens
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Define the scope for Gmail read-only access
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function authorize(callback) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirect_uris[0]);

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
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Token stored to', TOKEN_PATH);
      callback(oAuth2Client);
    } catch (err) {
      console.error('Error retrieving access token', err);
    }
  });
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
      const threads = res.data.threads;
      if (!threads || threads.length === 0) {
        console.log('No threads found.');
        return;
      }
      threads.forEach((thread) => {
        getThreadContent(auth, thread.id);
      });
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

      // Concatenate content of all messages in the thread
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

      console.log('Full Thread Content:', threadContent);
      summarizeThread(threadContent); // Pass concatenated content to summarization
    }
  );
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeThread(threadContent) {
  try {
    const prompt = `Summarize the following email thread. 
    Provide a concise summary of the conversation, followed by the tasks and their respective deadlines in the format:
    1. Task: Description of task
       Deadline: [Time or date for the task]
    
    Summary of the emails: \n\n${threadContent}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    });

    console.log(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('Error summarizing thread:', error);
  }
}

authorize(listThreads);
