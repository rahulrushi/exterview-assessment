'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { useParticipant } from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';

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

        micRef.current.play().catch((error) =>
          console.error('micRef.current.play() failed', error)
        );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="flex flex-col items-center space-y-4 bg-white rounded-lg shadow-lg p-4">
      <p className="text-xl font-medium text-gray-800">
        {displayName} | {webcamOn ? 'Webcam: ON' : 'Webcam: OFF'} | {micOn ? 'Mic: ON' : 'Mic: OFF'}
      </p>
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn && videoStream && (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={'200px'}
          width={'300px'}
        />
      )}
    </div>
  );
}
