# UI Development and Feature Implementation Assessment

This repository contains the implementation of the assessment by Rahul Hrushikesh. The project demonstrates the use of Next.js, Zustand, Next.js API routes, Prisma, MongoDB, TailwindCSS, ShadCN UI, ChatGPT, and VideoSDK.live. It showcases the development of core functionality, feature implementation, code quality, and innovation.

## Features

### 1. **UI Implementation with Next.js Starter Templates**
   - **Objective:** Build a responsive and user-friendly interface using Next.js.
   - **Implementation:**
     - The project is based on a [Next.js Starter Template](https://github.com/vercel/next.js).
     - Customized the layout with a clean, responsive design using TailwindCSS.
     - Responsive design has been tested across multiple devices (mobile, tablet, and desktop).
     - Followed best practices for Next.js project structure, component modularity, and dynamic routing.
     - Optimized images using Next.js' built-in image optimization.
   
### 2. **Code Compiler Feature**
   - **Objective:** Develop a secure, sandboxed JavaScript compiler.
   - **Implementation:**
     - Built a text area for JavaScript code input.
     - Displayed output or error messages below the text area.
     - Used `vm2` for creating a sandboxed environment to safely execute the JavaScript code.
     - Implemented a timeout mechanism to prevent infinite loops.
     - Restricted unsafe APIs like `eval` and system-level calls for security.
     - Error handling was implemented for clear syntax or runtime errors.
   
### 3. **Video Chat Feature using VideoSDK**
   - **Objective:** Integrated a video chat feature using VideoSDK.
   - **Implementation:**
     - Signed up for VideoSDK and integrated their API.
     - Created a simple video chat interface with start/stop video and mute/unmute audio functionalities.
     - Displayed participants in a grid layout.
     - The layout is responsive for different screen sizes.
     - Tested for stability under varying network conditions.

### Bonus Feature: **AI-Driven Chatbot for Scheduling Interviews**
   - **Objective:** Built an AI-driven chatbot for scheduling interviews.
   - **Implementation:**
     - Integrated ChatGPT API to build a chatbot.
     - Added functionalities for time slot selection and confirmation.
     - The chatbot provides a seamless interaction for scheduling interviews.

## Technologies Used

- **Next.js**: Framework for building the application.
- **Zustand**: State management for handling the app’s state.
- **Next.js API Routes**: Server-side logic and API routes for backend operations.
- **Prisma**: ORM for interacting with MongoDB.
- **MongoDB**: Database to store user data and other relevant information.
- **TailwindCSS**: Styling framework for responsive design and modern UI.
- **ShadCN UI**: A utility-first design system to enhance UI components.
- **ChatGPT**: AI model for building a chatbot for scheduling.
- **VideoSDK**: Integrated API for video chat functionality.

## Setup Instructions

### 1. **Clone the repository**

```bash
git clone https://github.com/rahul-hrushikesh/assessment.git
cd assessment

2. Install dependencies
npm install

3. Set up Environment Variables
DATABASE_URL="your_mongodb_connection_string"
VIDEOSDK_API_KEY="your_videosdk_api_key"
VIDEOSDK_API_SECRET="your_videosdk_api_secret"
OPENAI_API_KEY="your_openai_api_key"

4. Set up Prisma
Install Prisma CLI:

npm install @prisma/cli --save-dev
Generate Prisma Client:

Run the following command to generate Prisma Client:

bash
Copy code
npx prisma generate
Set up the Database:

To set up your MongoDB schema, run the following command to create the necessary tables (collections in MongoDB):

bash
Copy code
npx prisma migrate dev
Verify your Prisma Schema:

Check the prisma/schema.prisma file for the database schema, which is used to interact with MongoDB.

5. Run the Application Locally
Start the development server:

bash
Copy code
npm run dev
Open your browser and visit http://localhost:3000.