/* eslint-disable no-console */
"use client"
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import axios from 'axios'

interface Meeting {
  id: string
  title: string
  jobType: string
  date: string
  timeSlot: string
  participant: string
  meetingId: string 
}


const MeetingsPage: NextPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("/api/meetings");
        console.log(response.data)

        const data = await response.data
        
        if (data) {
          setMeetings(data)
        } else {
          console.warn('No meetings found in the response.')
        }
      } catch (error) {
        console.error('Error fetching meetings:', error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchMeetings()
  }, [])
  
  const handleDeleteMeeting = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/meetings/${id}`);
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== id)
      );
    } catch (error) {
      console.error('Error deleting meeting:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 container">
        <div className='flex w-full justify-between items-center h-20'>
        <h1 className="text-3xl font-bold text-center">Scheduled Meetings</h1>

          <Link href="/dashboard/chatbot/chat">
            <Button className="bg-blue-500 text-white">Schedule a New Meeting</Button>
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white p-4 rounded-lg shadow-md flex w-full items-center justify-between">
                <div>
                  <h2 className="text-xl text-black font-semibold">{meeting.title}</h2>
                  <p className="text-black">{meeting.jobType}</p>
                  <p className="text-gray-900">
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.timeSlot}
                  </p>
                  <p className="text-gray-900">Participant: {meeting.participant}</p>
                  <p className="text-gray-900">Room ID: {meeting.meetingId}</p> {/* Display Room ID */}
                </div>
                <Button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="bg-red-500 text-white mt-4"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
  )
}



export default MeetingsPage
