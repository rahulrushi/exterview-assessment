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
    <div className="container mx-auto min-h-screen bg-gray-100 px-4 py-6">
      <h3 className="mb-6 text-center text-2xl font-semibold text-indigo-600">
        Meeting Id: {meetingId}
      </h3>
      {joined && joined === 'JOINED' ? (
        <div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
          <Controls />
        </div>
      ) : joined && joined === 'JOINING' ? (
        <p className="text-center text-lg">Joining the meeting...</p>
      ) : (
        <div className="mt-6 flex justify-center">
          <button
            onClick={joinMeeting}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-lg transition"
          >
            Join Now
          </button>
        </div>
      )}
    </div>
  );
}
