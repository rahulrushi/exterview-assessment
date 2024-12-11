import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const typeDefs = `
  type Meeting {
    id: ID!
    title: String!
    jobType: String!
    date: String!
    timeSlot: String!
    participant: String!
    meetingId: String
    createdAt: String!
  }

  type Query {
    meetings: [Meeting!]!
    meeting(id: ID!): Meeting
  }

  type Mutation {
    createMeeting(
      title: String!
      jobType: String!
      date: String!
      timeSlot: String!
      participant: String!
      meetingId: String
    ): Meeting!
    deleteMeeting(id: ID!): Meeting
  }
`;

const resolvers = {
  Query: {
    meetings: async () => prisma.meeting.findMany(),
    meeting: async (_: unknown, { id }: { id: string }) =>
      prisma.meeting.findUnique({ where: { id } })
  },
  Mutation: {
    createMeeting: async (_: unknown, args: any) =>
      prisma.meeting.create({ data: args }),
    deleteMeeting: async (_: unknown, { id }: { id: string }) =>
      prisma.meeting.delete({ where: { id } })
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const yoga = createYoga({
  schema,
  context: ({ request }: { request: NextRequest }) => ({ request }),
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Correctly export GET and POST handlers with both request and context
export async function GET(request: NextRequest) {
  const ctx = { request }; // Define context object
  return yoga.handleRequest(request, ctx); // Pass both request and context
}

export async function POST(request: NextRequest) {
  const ctx = { request }; // Define context object
  return yoga.handleRequest(request, ctx); // Pass both request and context
}
