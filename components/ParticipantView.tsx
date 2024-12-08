/* eslint-disable no-console */
"use client"
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
  
          micRef.current
            .play()
            .catch((error) =>
              // eslint-disable-next-line no-console
              console.error('micRef.current.play() failed', error)
            );
        } else {
          micRef.current.srcObject = null;
        }
      }
    }, [micStream, micOn]);
  
    return (
      <div key={participantId}>
        <p>
          Participant: {displayName} | Webcam: {webcamOn ? 'ON' : 'OFF'} | Mic:{' '}
          {micOn ? 'ON' : 'OFF'}
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
            onError={(err) => console.error('Participant video error:', err)}
          />
        )}
      </div>
    );
  }
  