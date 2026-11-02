# Interview AI

Interview AI is a web application that helps users prepare for job interviews. Users can upload their resume, enter a job description, and get an interview preparation report generated using Gemini AI.

The report includes a profile match score, technical and behavioral questions, skill gaps, and a preparation roadmap. It can also generate a customized resume in PDF format.

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- SCSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

**Other Tools**
- Google Gemini API
- PDF Parse
- Puppeteer
- Zod

## Features

- User registration and login
- Upload resume in PDF format
- Analyze resume against a job description
- Generate technical and behavioral interview questions
- Get a match score for your profile
- Identify skills that need improvement
- Generate a day-wise preparation plan
- Download a customized resume as PDF
- View previously generated interview reports

## Project Structure

```text
interview-ai/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
│
├── Frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/
│       │   └── interview/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Rohan998-cloud/interview-ai.git
cd interview-ai
```

### Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/src/`:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000`

## API Routes

### Authentication

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/get-me` | Get logged-in user |

### Interview

| Method | Route | Description |
|---|---|---|
| POST | `/api/interview/` | Generate interview report |
| GET | `/api/interview/` | Get all reports |
| GET | `/api/interview/report/:interviewId` | Get a specific report |
| GET | `/api/interview/resume/pdf/:interviewReportId` | Generate resume PDF |

## Author

Rohan Sharma

[GitHub](https://github.com/Rohan998-cloud)
