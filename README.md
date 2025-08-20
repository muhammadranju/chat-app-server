# Chat App (Server) - with Push Notifications

**Live Demo:** [View it here](https://chat-app-server-8ec3.onrender.com/)

## Overview

This is the server-side component of the Chat App. It handles client connections and real-time messaging via HTTP or WebSocket (depending on `server.js` implementation). The app is structured for deployment on Vercel and includes environment configuration support.

## Project Structure

```

muhammadranju/chat-app-server
├── src/               # Source code for the server
├── .demo.env          # Environment variable template
├── .gitignore
├── package.json
├── package-lock.json
├── server.js          # Entry point of the application
└── vercel.json        # Vercel deployment configuration

```

## Features

- Real-time messaging via HTTP or WebSocket (to be confirmed in `server.js`)
- Organized source code under `src/`
- Environment variable configuration via `.demo.env`
- Ready for deployment on Vercel with `vercel.json`

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Environment variables configured (see `.demo.env`)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/muhammadranju/chat-app-server.git
   cd chat-app-server

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an environment file:

   ```bash
   cp .demo.env .env
   # Then edit `.env` to add your environment variable values
   ```

4. Run the server in development mode:

   ```bash
   npm run dev
   ```

5. The server should start, usually on a default port (such as 3000 or as specified in `.env`).

## Deployment

This project is configured for deployment on Vercel using the settings in Render. To deploy:

1. Connect your GitHub repository to Vercel.
2. Ensure your environment variables are properly set in the Vercel dashboard.
3. Deploy — Render will automatically build and serve the application.
