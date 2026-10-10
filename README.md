# TaskFlow — Personal Task Manager

TaskFlow is a small MERN-stack app where each user registers, logs in, and manages a private list of tasks.

## Key Features

- Register, log in, and log out
- Passwords hashed with bcrypt; JWT-based authentication
- Create, view, edit, and delete tasks (title, description, status, due date)
- Filter tasks by status (All / Pending / Completed)
- Users can only access their own tasks
- Responsive plain-CSS interface with loading states, error messages, and expired-session handling

## Technologies Used

- **Frontend:** React 18, Vite, Axios, plain CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (jsonwebtoken), bcrypt

## Prerequisites

- Node.js 18 or later
- A MongoDB database: local MongoDB or a free MongoDB Atlas cluster

## Installation

```bash
git clone <your-repo-url> taskflow
cd taskflow

cd server && npm install
cd ../client && npm install
```

## Environment Variables

**Server** — copy `server/.env.example` to `server/.env` and edit it:

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string (**you must provide this**) |
| `JWT_SECRET` | Long random string used to sign tokens (**you must provide this**) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `CLIENT_URL` | Frontend origin allowed by CORS (default `http://localhost:5173`) |

**Client** (optional) — copy `client/.env.example` to `client/.env` if your API is not at `http://localhost:5000/api`.

## Running the App

Start the backend (terminal 1):

```bash
cd server
npm run dev      # or: npm start
```

Start the frontend (terminal 2):

```bash
cd client
npm run dev
```

Open http://localhost:5173.

## API Endpoints

All task routes require the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account, returns token and user |
| POST | `/api/auth/login` | Log in, returns token and user |
| GET | `/api/auth/me` | Get the current user (used to restore a session) |
| GET | `/api/tasks?status=Pending\|Completed` | List your tasks, optionally filtered |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

Logout is handled on the client by discarding the token.

## How AI Tools Assisted Development

This project was generated with the help of an AI assistant (Claude). It was used for:

- **Component creation:** drafting the React components (Login, Register, Dashboard, TaskForm, TaskItem) and the plain CSS.
- **API development:** writing the Express routes, JWT middleware, input validation, and error handling.
- **Database integration:** defining the Mongoose User and Task models and scoping every task query to the logged-in user.
- **Debugging:** fixing a scaffolding problem (directories created incorrectly by a shell command) during generation.
- **Testing:** the API routes were exercised with an ad-hoc script that replaced the Mongoose model methods with in-memory stand-ins, and the client was confirmed to build with `npm run build`.

**Not verified:** the app has not been run against a real MongoDB instance, and the React UI has not been tested in a browser (no MongoDB or browser was available in the generation environment). There is no automated test suite. Please run through the main flows yourself after setup: register, log in, create/edit/delete a task, filter, and log out.
