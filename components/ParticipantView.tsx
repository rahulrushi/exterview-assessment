'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { useParticipant, useMeeting } from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';
import { Mic, Video, MicOff, VideoOff } from 'lucide-react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Stack,
  CircularProgress
} from '@mui/joy';

export function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream && webcamStream.track) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream && micStream.track) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error('micRef.current.play() failed', error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="background.surface"
      padding={2}
      borderRadius="md"
      boxShadow="md"
      width="100%"
    >
      <Typography
        level="h4"
        textAlign="center"
        fontWeight="medium"
        color="neutral"
      >
        {isLocal ? 'You' : displayName}
      </Typography>

      <Stack direction="row" spacing={1}>
        <IconButton
          color={webcamOn ? 'success' : 'neutral'}
          variant="soft"
          size="lg"
        >
          {webcamOn ? (
            <Video className="text-green-500" />
          ) : (
            <VideoOff className="text-gray-400" />
          )}
        </IconButton>
        <IconButton
          color={micOn ? 'success' : 'neutral'}
          variant="soft"
          size="lg"
        >
          {micOn ? (
            <Mic className="text-green-500" />
          ) : (
            <MicOff className="text-gray-400" />
          )}
        </IconButton>
      </Stack>

      <audio ref={micRef} autoPlay muted={isLocal} />

      {webcamOn && videoStream ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height="200px"
          width="300px"
        />
      ) : (
        <CircularProgress color="neutral" size="lg" />
      )}
    </Box>
  );
}
