# Google Drive Clone Project Brief

## Project Overview
A simplified Google Drive clone implementing core file storage and management functionality with modern web technologies.

## Core Requirements

### 1. Technical Stack
- **Frontend**: React.js + Next.js (App Router)
- **Backend**: Next.js API routes
- **Database**: Prisma with PostgreSQL
- **File Storage**: AWS S3
- **Authentication**: Clerk
- **Styling**: TailwindCSS + ShadcN UI

### 2. Core Features

#### User Authentication
- Sign up/Log in/Log out functionality
- Protected routes
- User-specific data isolation

#### File & Folder System
- Folder creation and management
- File upload capabilities
- Hierarchical file/folder structure display
- File metadata storage in database

#### File Management
- Rename files and folders
- Delete files and folders
- Basic file preview support
  - Images
  - PDFs
  - File information

#### User Interface
- Responsive design (mobile & desktop)
- Intuitive navigation
- Modern, clean aesthetic

## Technical Constraints
- File storage limited to cloud (AWS S3)
- Database stores only file/folder metadata
- Proper route protection required
- CORS configuration for API security
- File size and upload limits
- User storage quotas

## Timeline
1 week development timeline with following phases:
1. Setup & Authentication
2. Database & Storage Integration
3. Core File Operations
4. UI Development
5. Testing & Deployment

## Deliverables
- GitHub repository with complete source code
- Live deployed application
- Documentation for setup and usage

## Success Criteria
- All core features implemented and functional
- Responsive and intuitive user interface
- Secure user data isolation
- Efficient file/folder management
- Stable deployment with minimal latency