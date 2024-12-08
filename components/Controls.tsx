/* eslint-disable no-console */
'use client';
import { useMeeting } from '@videosdk.live/react-sdk';

export function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting({
    onError: (error) => console.error('Meeting Error:', error)
  });

  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>Toggle Mic</button>
      <button onClick={() => toggleWebcam()}>Toggle Webcam</button>
    </div>
  );
}
