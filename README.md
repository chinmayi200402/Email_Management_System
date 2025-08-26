# Email Management System

A full-stack email management application built with React, Express, and TypeScript. The system allows users to upload HTML email templates, preview them, and send bulk emails to recipients with Firebase authentication and comprehensive email logging.

## Features

- **Firebase Authentication**: User registration, login, and profile management
- **Email Template Management**: Upload and preview HTML email templates
- **Bulk Email Sending**: Send emails to multiple recipients via Resend API
- **Dashboard Analytics**: Track email statistics and user metrics
- **Email Logging**: Comprehensive email delivery tracking
- **Profile Management**: Update email and password securely
- **Responsive Design**: Modern UI built with Shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Wouter** for routing
- **TanStack Query** for server state management
- **Shadcn/ui** components with Radix UI
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Firebase Admin SDK** for authentication
- **Resend API** for email delivery

### Services
- **Firebase Authentication**
- **Neon Database** (PostgreSQL)
- **Resend** email service

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)
- Firebase project
- Resend API account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd email-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file and configure
cp .env.example .env
```

Required environment variables:
```env
# Firebase Configuration (Client)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Database
DATABASE_URL=your_postgresql_connection_string

# Email Service
RESEND_API_KEY=your_resend_api_key

# Firebase Admin (Server) - Optional for enhanced features
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to see the application.

## Configuration Guide

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Add your domain to Authorized domains
5. Get your configuration keys from Project Settings

### Database Setup

The app supports both PostgreSQL and in-memory storage:
- **Production**: Uses PostgreSQL via Neon Database
- **Development**: Falls back to memory storage if database is unavailable

### Email Service Setup

1. Sign up for [Resend](https://resend.com/)
2. Create an API key
3. Add the key to your environment variables

## Usage

### Creating an Account
1. Visit the login page
2. Click "Don't have an account? Create one"
3. Enter your email and password
4. Click "Create Account"

### Sending Bulk Emails
1. Log into your account
2. Upload an HTML email template
3. Preview the email content
4. Click "Send to All Recipients"
5. Monitor progress in the Email Logs section

### Managing Your Profile
1. Navigate to Profile in the top navigation
2. Update your email address
3. Change your password (requires current password)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/           # Utilities and configuration
├── server/                 # Express backend
│   ├── services/          # External service integrations
│   └── routes.ts          # API route definitions
├── shared/                 # Shared TypeScript schemas
└── package.json
```

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/dashboard/stats` - Get dashboard statistics
- `POST /api/send-email` - Send bulk emails
- `GET /api/email-logs` - Get email delivery logs

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Modern ES6+ syntax

## Deployment

The application is designed to work seamlessly on Replit with automatic deployment capabilities. For other platforms:

1. Build the application: `npm run build`
2. Set up environment variables on your hosting platform
3. Ensure database migrations are run
4. Start the production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact support.
