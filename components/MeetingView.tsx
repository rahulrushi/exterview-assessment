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
    <div className="container mx-auto px-4 py-6 bg-gray-100 min-h-screen">
      <h3 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
        Meeting Id: {meetingId}
      </h3>
      {joined && joined === 'JOINED' ? (
        <div>
          <Controls />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
        </div>
      ) : joined && joined === 'JOINING' ? (
        <p className="text-center text-lg">Joining the meeting...</p>
      ) : (
        <div className="flex justify-center mt-6">
          <button
            onClick={joinMeeting}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg transition"
          >
            Join Now
          </button>
        </div>
      )}
    </div>
  );
}
