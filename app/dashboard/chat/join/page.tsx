"use client";
import React, { useState } from "react";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "@/actions/videosdk";
import { MeetingView } from "@/components/MeetingView";
import { JoinScreen } from "@/components/JoinScreen";

const JoinMeetingPage = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>("");

  const getMeetingAndToken = async (id?: string, name?: string) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
    if (name) {
      setParticipantName(name);
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
    setParticipantName("");
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: participantName,
        debugMode: false, // Set to `true` to enable debugging features
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
};

export default JoinMeetingPage;
