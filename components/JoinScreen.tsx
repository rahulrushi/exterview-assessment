"use client";
import { useState } from "react";

export function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (meeting?: string, name?: string) => void;
}) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const [name, setName] = useState<string>("");

  const onClick = async () => {
    getMeetingAndToken(meetingId, name);
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
          setMeetingId(e.target.value);
        }}
        value={meetingId}
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
