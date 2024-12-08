/* eslint-disable no-console */
'use client';
import { useMeeting } from '@videosdk.live/react-sdk';

export function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting({
    onError: (error) => console.error('Meeting Error:', error)
  });

  return (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={() => leave()}
        className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg"
      >
        Leave
      </button>
      <button
        onClick={() => toggleMic()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        Toggle Mic
      </button>
      <button
        onClick={() => toggleWebcam()}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg"
      >
        Toggle Webcam
      </button>
    </div>
  );
}
