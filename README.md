# Sora - File Management System

A modern file management system built with Next.js that allows users to organize, upload, and preview files in a secure environment.

## Features

- 🔐 **Authentication**: Secure user authentication with SSO support
- 📁 **File Management**: Upload, preview, and organize files
- 📂 **Folder Organization**: Create and manage folders to keep files organized
- 🎯 **Dashboard**: Intuitive dashboard interface for easy file access
- 🌐 **Cloud Storage**: Cloudinary integration for reliable file storage

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io) ORM
- **File Storage**: [Cloudinary](https://cloudinary.com)
- **Authentication**: Built-in auth system with SSO capabilities

## Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- Cloudinary account
- Environment variables (see `.env.example`)

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd sora
npm install
```

2. Set up your environment variables:
```bash
cp .env.example .env
# Update .env with your values
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and database configuration
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [Cloudinary Documentation](https://cloudinary.com/documentation) - learn about Cloudinary.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
