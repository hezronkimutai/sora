# Technical Context

## Development Environment

### Prerequisites
- Node.js (v18.17 or higher)
- npm (v8.0 or higher)
- SQLite (v3.0 or higher)
- Cloudinary account
- Git

### Environment Variables
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=    # Cloud name for client-side operations
CLOUDINARY_API_KEY=                   # API Key for signed uploads
CLOUDINARY_API_SECRET=                # API Secret for request signing
CLOUDINARY_FOLDER=                    # Upload folder name

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Tech Stack Details

### Frontend
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@clerk/nextjs": "^4.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@radix-ui/react-icons": "^1.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "react-hook-form": "^7.0.0",
    "zod": "^3.22.0"
  }
}
```

### UI Components (shadcn/ui)
- Dialog
- DropdownMenu
- Button
- Card
- Input
- Toast
- Progress
- Skeleton

### Backend
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "aws-sdk": "^2.1.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

## Development Tools

### VS Code Extensions
- Prisma
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Configuration Files

#### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Tailwind Config (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other color definitions
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## Database Schema (schema.prisma)
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id
  email     String   @unique
  folders   Folder[]
  files     File[]
  createdAt DateTime @default(now())
}

model Folder {
  id        String   @id @default(cuid())
  name      String
  userId    String
  parentId  String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Folder?  @relation("FolderToFolder", fields: [parentId], references: [id], onDelete: Cascade)
  children  Folder[] @relation("FolderToFolder")
  files     File[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model File {
  id        String   @id @default(cuid())
  name      String
  type      String
  cloudinaryId String
  publicId    String
  size      Int
  userId    String
  folderId  String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder    Folder   @relation(fields: [folderId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Cloudinary Configuration
- **Upload Settings**
  - Signed uploads for security
  - Client-side direct upload
  - Progress tracking
  - File size validation

- **Resource Management**
  - Automatic file organization in folders
  - Secure resource delivery
  - Image optimization and transformations
  - PDF preview support

- **Integration Features**
  - Direct-to-Cloudinary upload with signed URLs
  - Preview generation for images and PDFs
  - Secure file deletion with resource cleanup
  - Public ID management for file access

## Development Workflow
1. Local setup with `.env` configuration
2. Database migrations with Prisma
3. Component development with shadcn/ui
4. API route testing with Postman/Thunder Client
5. TypeScript type checking
6. ESLint + Prettier formatting

## Deployment
- Frontend: Vercel
- Database: SQLite (deployed with application)
- Storage: Cloudinary
- Authentication: Clerk