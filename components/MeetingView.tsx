'use client';
import React, { useState } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Controls } from './Controls';
import { ParticipantView } from './ParticipantView';

export function MeetingView({
  onMeetingLeave,
  meetingId
}: {
  onMeetingLeave: () => void;
  meetingId: string;
}) {
  const [joined, setJoined] = useState<string | null>(null);
  const { join } = useMeeting();
  const { participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined('JOINED');
    },
    onMeetingLeft: () => {
      onMeetingLeave();
    }
  });
  const joinMeeting = () => {
    setJoined('JOINING');
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {meetingId}</h3>
      {joined && joined === 'JOINED' ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined === 'JOINING' ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}
