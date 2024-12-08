'use client';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Mic, Video, MicOff, VideoOff, PhoneOff  } from 'lucide-react';

export function Controls() {
  const { leave, toggleMic, toggleWebcam, localParticipant } = useMeeting({
    onError: (error) => console.error('Meeting Error:', error),
  });

  // Get mic and webcam state from the local participant
  const micOn = localParticipant?.micOn;
  const webcamOn = localParticipant?.webcamOn;

  return (
    <div className="flex justify-center space-x-6 mt-6">
      {/* Leave Button */}
      <button
        onClick={() => leave()}
        className="p-4 rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
      >
        <PhoneOff size={24} />
      </button>

      {/* Mic Toggle Button */}
      <button
        onClick={() => toggleMic()}
        className="p-4 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {micOn ? (
          <Mic className="text-white" />
        ) : (
          <MicOff className="text-white" />
        )}
      </button>

      {/* Webcam Toggle Button */}
      <button
        onClick={() => toggleWebcam()}
        className="p-4 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {webcamOn ? (
          <Video className="text-white" />
        ) : (
          <VideoOff className="text-white" />
        )}
      </button>
    </div>
  );
}
