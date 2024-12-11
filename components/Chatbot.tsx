'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { authToken, createMeeting } from '@/actions/videosdk';
import { Calendar } from '@/components/ui/calendar';
import { GraphQLClient } from 'graphql-request';

const graphqlEndpoint = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const graphqlClient = new GraphQLClient(`${graphqlEndpoint}/api/graphql`);

const CREATE_MEETING_MUTATION = `
  mutation CreateMeeting(
    $title: String!
    $jobType: String!
    $date: String!
    $timeSlot: String!
    $participant: String!
    $meetingId: String!
  ) {
    createMeeting(
      title: $title
      jobType: $jobType
      date: $date
      timeSlot: $timeSlot
      participant: $participant
      meetingId: $meetingId
    ) {
      id
      title
      jobType
      date
      timeSlot
      participant
    }
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // State for text input and interview details
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [participant, setParticipant] = useState('');

  // Step state to control which step of the form is displayed
  const [step, setStep] = useState(0);

  const startChatting = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      'Bot: Hello! How can I assist you today? If you want to schedule an interview, Please provide me with the following details: 1. Interview Title: 2. Job Type: 3. Interview Date: 4. Time Slot: 5. Participant Details: Once you provide me with this information, I can help you schedule the interview.'
    ]);

    // await handleSendMessage(`you are a interview scheduler collectdetails ask user for interview title, job type, Interview Date,Time Slot, participant details `)

    setLoading(false);
  };

  const handleSendMessage = async (userMessage: string) => {
    // setMessages((prev) => [...prev, `You: ${userMessage}`]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chatbot', {
        message: userMessage
      });
      const botMessage = response.data.reply;
      setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
    } catch (error) {
      setMessages((prev) => [...prev, 'Bot: Sorry, something went wrong.']);
    }
    setLoading(false);
  };

  const handleNextStep = async () => {
    setLoading(true);

    if (step === 0 && title) {
      // Send title to the bot
      setMessages((prev) => [...prev, `You: Interview Title: ${title}`]);
      setStep(step + 1);
    } else if (step === 1 && jobType) {
      // Send job type to the bot
      setMessages((prev) => [...prev, `You: Job Type: ${jobType}`]);
      setStep(step + 1);
    } else if (step === 2 && date) {
      // Send date to the bot
      setMessages((prev) => [...prev, `You: Interview Date: ${date}`]);
      setStep(step + 1);
    } else if (step === 3 && timeSlot) {
      // Send time slot to the bot
      setMessages((prev) => [...prev, `You: Time Slot: ${timeSlot}`]);
      setStep(step + 1);
    } else if (step === 4 && participant) {
      // Send participant name to the bot
      setMessages((prev) => [...prev, `You: Participant: ${participant}`]);
      setStep(step + 1);
    }

    setLoading(false);
  };

  // const handleScheduleInterview = async () => {
  //   setLoading(true);
  //   try {
  //     // Create a meeting and get the meetingId
  //     const meetingId = await createMeeting({ token: authToken });

  //     await handleSendMessage(`give a message that  interview has been scheduled successfully! and thank ${participant} for Scheduling an interview with the following details:
  //         Title: ${title}, Job Type: ${jobType}, Date: ${date}, Time Slot: ${timeSlot}, Participant: ${participant}, Meeting Id: ${meetingId}`);

  //     // Confirm scheduling
  //     await axios.post('/api/meetings', {
  //       title,
  //       jobType,
  //       date,
  //       timeSlot,
  //       participant,
  //       meetingId
  //     });

  //     setMessages((prev) => [
  //       ...prev,
  //       'Bot: Your interview has been scheduled successfully!'
  //     ]);
  //     setStep(step + 1);
  //   } catch (error) {
  //     setMessages((prev) => [
  //       ...prev,
  //       'Bot: Sorry, something went wrong while scheduling the interview.'
  //     ]);
  //   }
  //   setLoading(false);
  // };

  const handleScheduleInterview = async () => {
    setLoading(true);
    try {
      const meetingId = await createMeeting({ token: authToken });

      const variables = {
        title,
        jobType,
        date,
        timeSlot,
        participant,
        meetingId
      };

      await graphqlClient.request(CREATE_MEETING_MUTATION, variables);

      await handleSendMessage(`The interview has been scheduled successfully! Thank you ${participant} for scheduling an interview with the following details:
        Title: ${title}, Job Type: ${jobType}, Date: ${date}, Time Slot: ${timeSlot}, Participant: ${participant}, Meeting ID: ${meetingId}`);

      // Confirm scheduling
      setMessages((prev) => [
        ...prev,
        'Bot: Your interview has been scheduled successfully!'
      ]);
      setStep(step + 1);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        'Bot: Sorry, something went wrong while scheduling the interview.'
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex h-full flex-col space-y-4 rounded-lg bg-white p-4 text-black shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold">
        AI Chatbot for Scheduling Interviews
      </h1>

      <div className="space-y-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="text-gray-800">
            {msg}
          </div>
        ))}
      </div>

      <div className="space-y-4 ">
        {/* Start Chatting Button */}
        {messages.length === 0 && (
          <div className="flex flex-col space-y-2">
            <Button onClick={startChatting} className="flex items-center">
              Start Chatting with AI
            </Button>
          </div>
        )}

        {/* Interview Scheduling Flow */}
        {messages.length > 0 && step === 0 && (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">What is the title of the interview?</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter interview title"
            />
            <Button onClick={handleNextStep} disabled={!title || loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Next'}
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">
              What is the job type for the interview?
            </p>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <div className="flex items-center justify-between">
                  <span>{jobType || 'Select Job Type'}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">
                  Software Engineer
                </SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleNextStep} disabled={!jobType || loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Next'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col space-y-2 text-black">
            <p className="text-Black">
              Please select a date for the interview.
            </p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            {/* <Input
              className="text-black"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select a date"
            /> */}
            <Button onClick={handleNextStep} disabled={!date || loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Next'}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">
              Please select a time slot for the interview.
            </p>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <div className="flex items-center justify-between">
                  <span>{timeSlot || 'Select Time Slot'}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleNextStep} disabled={!timeSlot || loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Next'}
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">Please enter the participant name.</p>
            <Input
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              placeholder="Enter participant's name"
            />
            <Button
              onClick={handleScheduleInterview}
              disabled={!participant || loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                'Schedule Interview'
              )}
            </Button>
          </div>
        )}

        {/* Chat UI */}
        {messages.length > 0 && step === 5 && (
          <div className="flex flex-col space-y-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something else"
            />
            <Button
              onClick={() => handleSendMessage(input)}
              className="flex items-center"
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
