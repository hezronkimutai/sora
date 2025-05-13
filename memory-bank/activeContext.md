# Active Context

## Current Focus
Building a Google Drive clone with emphasis on:
1. Clean, modular architecture
2. Secure file handling
3. Efficient database design
4. Responsive user interface

## Recent Decisions

### Architecture Decisions
1. **Next.js App Router**
   - Leveraging server components for improved performance
   - Built-in API routes for backend functionality
   - Simplified deployment process

2. **Authentication with Clerk**
   - Robust auth system out of the box
   - Built-in user management
   - Easy integration with Next.js

3. **Database Choice (SQLite + Prisma)**
    - Lightweight and portable
    - Zero-configuration database
    - File-based storage
    - Type-safe database operations

4. **File Storage (Cloudinary)**
    - Built-in image optimization
    - Automatic CDN delivery
    - Media transformation features
    - Simple upload integration

### Implementation Patterns
1. **File Upload Strategy**
    - Direct-to-Cloudinary upload with signed URLs
    - Progress tracking with client-side hooks
    - Metadata stored in SQLite

2. **Folder Structure**
   - Recursive folder relationships
   - Efficient querying patterns
   - Cascade deletions for cleanup

3. **UI Components**
   - ShadCN UI for consistent design
   - Custom hooks for file operations
   - Responsive layout system

## Current Considerations

### Performance Optimization
- Implement pagination for large folders
- Use virtual scrolling for file lists
- Optimize image previews
- Cache frequently accessed data

### Security Measures
- Validate file types on upload
- Implement file size limits
- Secure route protection
- Regular security audits

### User Experience
- Clear loading states
- Error handling
- Progress indicators
- Intuitive navigation

## Next Steps

### 1. Project Setup (Day 1)
- [ ] Initialize Next.js project
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install dependencies
- [ ] Configure Clerk authentication

### 2. Database & Storage Setup (Day 2)
- [ ] Set up SQLite database
- [ ] Configure Prisma
- [ ] Create database schema
- [ ] Set up Cloudinary account
- [ ] Configure Cloudinary credentials

### 3. Core Features (Days 3-4)
- [ ] Implement user authentication
- [ ] Create folder structure
- [ ] Implement file upload
- [ ] Add file/folder operations
- [ ] Create file preview system

### 4. UI Development (Day 5)
- [ ] Build navigation component
- [ ] Create file/folder grid/list view
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Implement error handling

### 5. Testing & Deployment (Days 6-7)
- [ ] Write unit tests
- [ ] Perform integration testing
- [ ] Deploy to Vercel
- [ ] Set up production database
- [ ] Configure production S3 bucket

## Project Insights

### Key Patterns to Maintain
1. **Type Safety**
   - Strict TypeScript usage
   - Zod validation
   - Prisma generated types

2. **Performance**
   - Server components where possible
   - Optimistic updates
   - Efficient data fetching
   
3. **Security**
   - Input validation
   - Route protection
   - Secure file handling

### Potential Challenges
1. **File Upload**
   - Large file handling
   - Upload progress tracking
   - Error recovery

2. **Performance**
   - Large folder navigation
   - File preview loading
   - Database query optimization

3. **UX Considerations**
   - Mobile responsiveness
   - Loading states
   - Error feedback

## Learning Objectives
1. Modern Next.js patterns
2. File handling best practices
3. Secure cloud storage implementation
4. Efficient database design
5. Responsive UI development