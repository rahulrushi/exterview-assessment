// src/store/meetingStore.ts
import { create } from "zustand";

interface MeetingState {
  meetingId: string | null;
  participantName: string;
  setMeetingDetails: (meetingId: string, participantName: string) => void;
  clearMeetingDetails: () => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  meetingId: typeof window !== "undefined" ? localStorage.getItem("meetingId") : null,
  participantName: typeof window !== "undefined" ? localStorage.getItem("participantName") || "" : "",
  setMeetingDetails: (meetingId, participantName) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("meetingId", meetingId);
      localStorage.setItem("participantName", participantName);
    }
    set({ meetingId, participantName });
  },
  clearMeetingDetails: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("meetingId");
      localStorage.removeItem("participantName");
    }
    set({ meetingId: null, participantName: "" });
  },
}));

export default useMeetingStore;
