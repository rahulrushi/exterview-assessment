'use client';

import React, { useState, useEffect } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Controls } from './Controls';
import { ParticipantView } from './ParticipantView';
import { Loader, Users } from 'lucide-react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/joy';

type MeetingViewProps = {
  onMeetingLeave: () => void;
  meetingId: string;
};

export function MeetingView({ onMeetingLeave, meetingId }: MeetingViewProps) {
  const [joined, setJoined] = useState<'JOINED' | 'JOINING' | null>(null);
  const { join, leave, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined('JOINED');
    },
    onMeetingLeft: () => {
      onMeetingLeave();
      setJoined(null); // Reset state when the meeting is left
    }
  });

  useEffect(() => {
    // If the meeting ID changes, reset the meeting state
    setJoined(null);
  }, [meetingId]);

  const joinMeeting = () => {
    setJoined('JOINING');
    join();
  };

  return (
    <Box
      className="container mx-auto"
      minHeight="100vh"
      bgcolor="neutral.100"
      padding={4}
    >
      <Typography
        level="h4"
        textAlign="center"
        fontWeight="bold"
        color="primary"
        marginBottom={3}
      >
        <Users className="mr-2 inline" /> Meeting Id: {meetingId}
      </Typography>

      {joined === 'JOINED' ? (
        <Box>
          <Grid container spacing={2} marginTop={2}>
            {[...participants.keys()].map((participantId) => (
              <Grid xs={12} sm={6} lg={4} xl={3} key={participantId}>
                <ParticipantView participantId={participantId} />
              </Grid>
            ))}
          </Grid>
          <Controls />
        </Box>
      ) : joined === 'JOINING' ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={6}
        >
          <CircularProgress color="primary" size="lg" />
          <Typography marginLeft={2} level="body-lg">
            Joining the meeting...
          </Typography>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" marginTop={6}>
          <Button
            onClick={joinMeeting}
            variant="solid"
            color="primary"
            size="lg"
          >
            Join Now
          </Button>
        </Box>
      )}
    </Box>
  );
}
