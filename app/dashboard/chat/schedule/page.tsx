'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraphQLClient, gql } from 'graphql-request';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress
} from '@mui/joy';

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

const graphqlEndpoint =
  process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000';
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
        if (data && data.meetings) {
          setMeetings(data.meetings);
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
      setLoading(true);
      await graphqlClient.request<{ deleteMeeting: { id: string } }>(
        DELETE_MEETING_MUTATION,
        { id }
      );
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
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography level="h2" sx={{ fontWeight: 'bold' }}>
          Scheduled Meetings
        </Typography>
        <Link href="/dashboard/chatbot/chat">
          <Button variant="solid" color="primary">
            Schedule a New Meeting
          </Button>
        </Link>
      </Stack>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}
        >
          <CircularProgress />
        </Box>
      ) : meetings.length === 0 ? (
        <Typography level="body-lg" textAlign="center">
          No meetings scheduled.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {meetings.map((meeting) => (
            <Card key={meeting.id} variant="outlined" sx={{ boxShadow: 'lg' }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography level="h4" fontWeight="bold" gutterBottom>
                      {meeting.title}
                    </Typography>
                    <Typography level="body-md">{meeting.jobType}</Typography>
                    <Typography level="body-md">
                      {new Date(meeting.date).toLocaleDateString()} at{' '}
                      {meeting.timeSlot}
                    </Typography>
                    <Typography level="body-md">
                      Participant: {meeting.participant}
                    </Typography>
                    <Typography level="body-md">
                      Room ID: {meeting.meetingId}
                    </Typography>
                  </Box>
                  <Button
                    variant="soft"
                    color="danger"
                    onClick={() => handleDeleteMeeting(meeting.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MeetingsPage;
