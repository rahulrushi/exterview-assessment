'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { useParticipant } from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';
import { Mic, Video, MicOff, VideoOff } from 'lucide-react';

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
        {displayName}
      </p>
      <div className="flex space-x-2">
        {/* Webcam Icon */}
        <div className={`p-2 rounded-full ${webcamOn ? 'bg-green-100' : 'bg-gray-200'}`}>
          {webcamOn ? (
            <Video className={`text-gray-600 ${webcamOn ? 'text-green-500' : 'text-gray-400'}`} />
          ) : (
            <VideoOff className="text-gray-400" />
          )}
        </div>

        {/* Mic Icon */}
        <div className={`p-2 rounded-full ${micOn ? 'bg-green-100' : 'bg-gray-200'}`}>
          {micOn ? (
            <Mic className={`text-gray-600 ${micOn ? 'text-green-500' : 'text-gray-400'}`} />
          ) : (
            <MicOff className="text-gray-400" />
          )}
        </div>
      </div>
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
