'use client';
import { useEffect, useState } from 'react';
import useMeetingStore from '@/lib/meetingStore';
import { Box, Button, Input, Stack, Typography } from '@mui/joy';

export function JoinScreen({
  getMeetingAndToken
}: {
  getMeetingAndToken: (meeting?: string, name?: string) => void;
}) {
  const { meetingId, participantName } = useMeetingStore();
  const [localMeetingId, setLocalMeetingId] = useState<string | undefined>();
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (meetingId && participantName) {
      getMeetingAndToken(meetingId, participantName);
    }
  }, [meetingId, participantName, getMeetingAndToken]);

  const onClick = async () => {
    getMeetingAndToken(localMeetingId, name);
  };

  const isButtonDisabled = !name.trim();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="neutral.100"
      padding={4}
    >
      <Box
        width="100%"
        maxWidth="400px"
        padding={3}
        borderRadius="md"
        boxShadow="sm"
        bgcolor="background.surface"
      >
        <Typography
          level="h4"
          textAlign="center"
          color="primary"
          fontWeight="bold"
          marginBottom={2}
        >
          Join or Create Meeting
        </Typography>
        <Stack spacing={2}>
          <Input
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="lg"
          />
          <Input
            placeholder="Enter Meeting Id"
            value={localMeetingId}
            onChange={(e) => setLocalMeetingId(e.target.value)}
            fullWidth
            size="lg"
          />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          marginTop={3}
          justifyContent="center"
        >
          <Button
            onClick={onClick}
            disabled={isButtonDisabled}
            variant="solid"
            color="primary"
            size="lg"
          >
            Join Meeting
          </Button>
          <Button
            onClick={onClick}
            disabled={isButtonDisabled}
            variant="solid"
            color="success"
            size="lg"
          >
            Create Meeting
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
