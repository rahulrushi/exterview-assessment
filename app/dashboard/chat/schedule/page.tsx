'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraphQLClient, gql } from 'graphql-request';

interface Meeting {
  id: string;
  title: string;
  jobType: string;
  date: string;
  timeSlot: string;
  participant: string;
  meetingId: string;
}

interface FetchMeetingsResponse {
  meetings: Meeting[];
}

const graphqlEndpoint = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const graphqlClient = new GraphQLClient(`${graphqlEndpoint}/api/graphql`);

const FETCH_MEETINGS_QUERY = gql`
  query {
    meetings {
      id
      title
      jobType
      date
      timeSlot
      participant
      meetingId
    }
  }
`;

const DELETE_MEETING_MUTATION = gql`
  mutation deleteMeeting($id: ID!) {
    deleteMeeting(id: $id) {
      id
    }
  }
`;

const MeetingsPage: NextPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data =
          await graphqlClient.request<FetchMeetingsResponse>(
            FETCH_MEETINGS_QUERY
          );
        console.log(data);
        if (data && data.meetings) {
          setMeetings(data.meetings);
        } else {
          console.warn('No meetings found in the response.');
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDeleteMeeting = async (id: string) => {
    try {
      console.log('Deleting meeting with ID:', id); // Log the ID
      setLoading(true);

      // Log the GraphQL query and variables
      console.log('Sending GraphQL mutation with ID:', { id });

      const response = await graphqlClient.request<{
        deleteMeeting: { id: string };
      }>(DELETE_MEETING_MUTATION, { id });

      console.log('Mutation response:', response);

      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== id)
      );
    } catch (error) {
      console.error('Error deleting meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-6">
      <div className="flex h-20 w-full items-center justify-between">
        <h1 className="text-center text-3xl font-bold">Scheduled Meetings</h1>

        <Link href="/dashboard/chatbot/chat">
          <Button className="bg-blue-500 text-white">
            Schedule a New Meeting
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex w-full items-center justify-between rounded-lg bg-white p-4 shadow-md"
            >
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {meeting.title}
                </h2>
                <p className="text-black">{meeting.jobType}</p>
                <p className="text-gray-900">
                  {new Date(meeting.date).toLocaleDateString()} at{' '}
                  {meeting.timeSlot}
                </p>
                <p className="text-gray-900">
                  Participant: {meeting.participant}
                </p>
                <p className="text-gray-900">Room ID: {meeting.meetingId}</p>
              </div>
              <Button
                onClick={() => handleDeleteMeeting(meeting.id)}
                className="mt-4 bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
