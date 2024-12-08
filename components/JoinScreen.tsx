"use client";
import { useEffect, useState } from "react";
import useMeetingStore from "@/lib/meetingStore";

export function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (meeting?: string, name?: string) => void;
}) {
  const { meetingId, participantName } = useMeetingStore();
  const [localMeetingId, setLocalMeetingId] = useState<string | undefined>();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (meetingId && participantName) {
      getMeetingAndToken(meetingId, participantName);
    }
  }, [meetingId, participantName, getMeetingAndToken]);

  const onClick = async () => {
    getMeetingAndToken(localMeetingId, name);
  };

  const isButtonDisabled = !name.trim();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600">Join or Create Meeting</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="text"
            placeholder="Enter Meeting Id"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setLocalMeetingId(e.target.value)}
            value={localMeetingId}
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClick}
            disabled={isButtonDisabled}
            className="w-48 p-3 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 transition"
          >
            Join Meeting
          </button>
          <button
            onClick={onClick}
            disabled={isButtonDisabled}
            className="w-48 p-3 bg-green-600 text-white rounded-lg disabled:bg-gray-400 transition"
          >
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
