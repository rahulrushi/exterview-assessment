"use client";
import React, { useEffect } from "react";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "@/actions/videosdk";
import { MeetingView } from "@/components/MeetingView";
import { JoinScreen } from "@/components/JoinScreen";
import useMeetingStore from "@/lib/meetingStore";

const JoinMeetingPage = () => {
  const { meetingId, participantName, setMeetingDetails, clearMeetingDetails } =
    useMeetingStore();

  const getMeetingAndToken = async (id?: string, name?: string) => {
    const newMeetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingDetails(newMeetingId, name || "Anonymous");
  };

  const onMeetingLeave = () => {
    clearMeetingDetails();
  };

  useEffect(() => {
    if (authToken && meetingId && participantName) {
      // Redirect to Meeting View if meeting details are in the state
      setMeetingDetails(meetingId, participantName);
    }
  }, [meetingId, participantName, setMeetingDetails]);

  return authToken && meetingId && participantName ? (
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
