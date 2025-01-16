import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  // Import styles from react-datepicker
import { Input, Button, Form, Space, Card } from 'antd';


const CreateEvent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleSubmit = () => {
    const eventData = {
      eventName,
      eventDescription,
      startDate,
      endDate,
    };
    console.log('Event Created:', eventData);
    // Handle form submission (e.g., sending data to an API)
  };

  return (
    <div className="create-event-container">
      <Card title="Create Calendar Event" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Event Name">
            <Input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              required
            />
          </Form.Item>

          <Form.Item label="Event Description">
            <Input
              type="text"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Enter event description"
              required
            />
          </Form.Item>

          <Form.Item label="Start Date and Time">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="Pp" // Date and time format
              timeIntervals={15} // Time intervals in minutes
              timeCaption="Time"
              placeholderText="Select start date and time"
              required
            />
          </Form.Item>

          <Form.Item label="End Date and Time">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              dateFormat="Pp" // Date and time format
              timeIntervals={15} // Time intervals in minutes
              timeCaption="Time"
              placeholderText="Select end date and time"
              required
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              Create Calendar Event
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};



export default CreateEvent;



