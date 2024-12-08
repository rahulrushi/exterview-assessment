import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const meeting = await prisma.meeting.findMany();
    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const { title, jobType, date, timeSlot, participant } = await req.json()

  if (!title || !jobType || !date || !timeSlot || !participant) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  try {
    const interview = await prisma.meeting.create({
      data: {
        title,
        jobType,
        date: new Date(date),
        timeSlot,
        participant,
      },
    })

    return NextResponse.json({ message: 'Interview scheduled successfully', interview })
  } catch (error) {
    console.error('Error scheduling interview:', error)
    return NextResponse.json({ error: 'Error scheduling interview' }, { status: 500 })
  }
}
