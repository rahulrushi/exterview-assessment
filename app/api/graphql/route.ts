import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define your GraphQL schema using type definitions and resolvers
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

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Set up Yoga server with the schema
const yoga = createYoga({
  schema,
  context: ({ request }) => ({ request }),
  cors: {
    origin: '*', // Allow requests from all origins, modify as needed
    methods: ['GET', 'POST']
  }
});

// Export the handler for Next.js
export { yoga as GET, yoga as POST };
