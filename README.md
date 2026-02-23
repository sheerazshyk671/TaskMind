# TaskMind - AI-Powered Productivity

TaskMind is a modern, AI-powered to-do list built with Next.js, Firebase, and Genkit. It helps you break down complex goals into actionable subtasks and identifies your most important focus using AI.

## Local Setup Instructions

Follow these steps to get the project running on your computer:

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js 18 or later installed.
- **Firebase Account**: You'll need a Firebase project.
- **Google AI API Key**: To use the GenAI features, get an API key from [Google AI Studio](https://aistudio.google.com/).

### 2. Download the Project
Download the source code as a ZIP file from the Firebase Studio interface and extract it to a folder.

### 3. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env` in the root directory and add your keys:
```env
# Firebase Configuration (Copy from your Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 5. Enable Firebase Services
In your [Firebase Console](https://console.firebase.google.com/):
- **Authentication**: Enable Google and Anonymous sign-in providers.
- **Firestore**: Create a database in "Production" mode. Use the rules provided in `firestore.rules`.

### 6. Run the Development Server
Start the Next.js app:
```bash
npm run dev
```
The app will be available at `http://localhost:9002` (or the port specified in your console).

### 7. Run Genkit (Optional)
To test and debug AI flows locally:
```bash
npm run genkit:dev
```

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Genkit with Google Gemini
- **UI**: Shadcn/UI + Tailwind CSS
- **Icons**: Lucide React
