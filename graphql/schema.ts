import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Meeting {
    id: String
    title: String
    jobType: String
    date: String
    timeSlot: String
    participant: String
    meetingId: String
  }

  type Query {
    meetings: [Meeting]!
  }
`;
