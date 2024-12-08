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
    // Redirect if meeting details are already set
    if (meetingId && participantName) {
      getMeetingAndToken(meetingId, participantName);
    }
  }, [meetingId, participantName, getMeetingAndToken]);

  const onClick = async () => {
    getMeetingAndToken(localMeetingId, name);
  };

  const isButtonDisabled = !name.trim();

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Your Name"
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setLocalMeetingId(e.target.value);
        }}
        value={localMeetingId}
      />
      <button onClick={onClick} disabled={isButtonDisabled}>
        Join
      </button>
      {" or "}
      <button onClick={onClick} disabled={isButtonDisabled}>
        Create Meeting
      </button>
    </div>
  );
}
