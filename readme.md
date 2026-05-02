# Project Setup Guide

Follow the instructions below to get both the frontend and backend running locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) and npm
* [Docker](https://www.docker.com/) (must be running to start the database)
* MongoDB (either running locally or a cloud URI)

---

## 1. Start the Frontend

Open a terminal window and execute the following commands to install dependencies and start the frontend development server:
```bash
cd frontend
npm install
npm run dev
```

---

## 2. Start the Backend

Open a **new** terminal window for the backend setup. 

### Environment Variables
First, navigate into the backend directory and create your environment variables file:
```bash
cd backend
touch .env
```

Open the newly created `.env` file and add the following configuration. Make sure to paste in your actual Gemini API key and Redis URL (if you aren't using the default local Redis container below):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://127.0.0.1:27017/content-curator
REDIS_URL=redis://127.0.0.1:6379
```

### Start the Redis Container
Ensure Docker is running on your machine, then spin up a local Redis container in the background:
```bash
docker run --name app-redis -p 6379:6379 -d redis
```

### Run the Backend Server
With your `.env` file saved and Redis running, install the backend dependencies and start the server:
```bash
npm install
npm run dev
