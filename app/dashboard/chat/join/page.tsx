'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // For dynamic import

// Dynamically import MeetingProvider, MeetingConsumer, and MeetingView to disable SSR
const MeetingProvider = dynamic(
  () => import('@videosdk.live/react-sdk').then((mod) => mod.MeetingProvider),
  { ssr: false }
);
const MeetingConsumer = dynamic(
  () => import('@videosdk.live/react-sdk').then((mod) => mod.MeetingConsumer),
  { ssr: false }
);
const MeetingView = dynamic(() => import('@/components/MeetingView').then((mod) => mod.MeetingView), { ssr: false });

import { authToken, createMeeting } from '@/actions/videosdk';
import { JoinScreen } from '@/components/JoinScreen';
import useMeetingStore from '@/lib/meetingStore';

const JoinMeetingPage = () => {
  const { meetingId, participantName, setMeetingDetails, clearMeetingDetails } =
    useMeetingStore();

  const [isClientSide, setIsClientSide] = useState(false);

  // To ensure the component only runs on the client-side
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  const getMeetingAndToken = async (id?: string, name?: string) => {
    const newMeetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingDetails(newMeetingId, name || 'Anonymous');
  };

  const onMeetingLeave = () => {
    clearMeetingDetails();
  };

  useEffect(() => {
    if (authToken && meetingId && participantName) {
      setMeetingDetails(meetingId, participantName);
    }
  }, [meetingId, participantName, setMeetingDetails]);

  // Ensure the page is only rendered on the client-side
  if (!isClientSide) {
    return null; // Prevent server-side rendering issues
  }

  return authToken && meetingId && participantName ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: participantName,
        debugMode: false,
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
