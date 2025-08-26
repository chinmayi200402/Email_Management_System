# Email Management System

## Overview

This is a full-stack email management application built with React, Express, and TypeScript. The system allows users to upload HTML email templates, preview them, and send bulk emails to a list of recipients. It features user authentication via Firebase, comprehensive email logging, and a dashboard with analytics. The application supports both database storage (PostgreSQL via Drizzle ORM) and fallback memory storage for development environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Authentication SDK

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for user management, email operations, and analytics
- **File Processing**: Multer middleware for HTML email template uploads
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Drizzle migrations with shared TypeScript schema definitions
- **Session Storage**: PostgreSQL-based session management with connect-pg-simple

### Authentication and Authorization
- **Client Authentication**: Firebase Auth with email/password authentication
- **Server Authentication**: Firebase Admin SDK for token verification
- **User Management**: Hybrid approach supporting both Firebase users and local storage
- **Route Protection**: Authentication guards on both client and server routes

### External Dependencies
- **Database Provider**: Neon Database (PostgreSQL-compatible serverless database)
- **Email Service**: Resend API for reliable email delivery
- **Authentication Provider**: Firebase for user authentication and authorization
- **UI Components**: Radix UI for accessible, unstyled component primitives
- **Validation**: Zod for runtime type validation and schema definition
- **Development Tools**: Replit-specific plugins for development environment integration

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Resend**: Email delivery service for bulk email sending
- **Firebase**: Authentication and user management platform

### Development Dependencies
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution engine for development server

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Low-level UI primitives for building design systems
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs