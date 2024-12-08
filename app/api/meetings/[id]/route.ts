// /app/api/meetings/[id]/route.ts

import { NextResponse } from 'next/server' // Import NextResponse for handling responses
import prisma from '@/lib/prisma' // Adjust the import for Prisma if needed

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Delete the meeting with the given id
    await prisma.meeting.delete({
      where: { id: String(id) },
    })

    // Return a successful response using NextResponse
    return NextResponse.json({ message: 'Meeting deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting meeting:', error)
    
    // Return an error response using NextResponse
    return NextResponse.json({ error: 'Error deleting meeting' }, { status: 500 })
  }
}
