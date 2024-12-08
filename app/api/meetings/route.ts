import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const meeting = await prisma.meeting.findMany({
      where: {
        meetingId: {
          not: null, // Ensure meetingId is not null
        },
      },
    });
    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body once
    const { title, jobType, date, timeSlot, participant, meetingId } = await req.json();

    // Validate required fields
    if (!title || !jobType || !date || !timeSlot || !participant || !meetingId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create the meeting in the database
    const interview = await prisma.meeting.create({
      data: {
        title,
        jobType,
        date: new Date(date),
        timeSlot,
        participant,
        meetingId,
      },
    });

    // Return success response
    return NextResponse.json({
      message: 'Interview scheduled successfully',
      interview,
    });
  } catch (error) {
    // Handle errors
    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Error scheduling interview' },
      { status: 500 }
    );
  }
}
