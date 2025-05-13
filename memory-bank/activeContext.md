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
    - Built-in image optimization and transformations
    - Automatic CDN delivery with secure URLs
    - Direct client-side uploads with signed URLs
    - Preview support for images and PDFs
    - Automatic file organization in folders
    - Real-time upload progress tracking

### Implementation Patterns
1. **File Upload Strategy**
    - Secure signed URLs for direct-to-Cloudinary upload
    - Client-side upload progress tracking
    - File metadata and relationships in SQLite
    - File type validation and size limits
    - Automatic file preview generation

2. **Folder Structure**
   - Recursive folder relationships
   - Efficient querying patterns
   - Cascade deletions for cleanup

3. **UI Components**
    - ShadCN UI components integrated:
      - Dialog for rename operations
      - DropdownMenu for file actions
      - Progress indicators for uploads
      - Modal for file previews
    - Custom components:
      - FileList with grid/list views
      - FolderList with navigation
      - PreviewModal for file viewing
      - RenameDialog for file/folder rename
    - Responsive layout system with Tailwind
    - Client-side state management with React hooks

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

### 1. Project Setup ✅
- [x] Initialize Next.js project
- [x] Configure TypeScript
- [x] Set up Tailwind CSS
- [x] Install dependencies
- [x] Configure Clerk authentication

### 2. Database & Storage Setup ✅
- [x] Set up SQLite database
- [x] Configure Prisma
- [x] Create database schema
- [x] Set up Cloudinary account
- [x] Configure Cloudinary credentials

### 3. Core Features (In Progress)
- [x] Implement user authentication
- [x] Create folder structure
- [x] Implement file upload
- [x] Add file/folder operations
- [x] Create file preview system
- [ ] Add error notifications
- [ ] Implement file search
- [ ] Add bulk operations

### 4. UI Development (In Progress)
- [x] Build navigation component
- [x] Create file/folder grid/list view
- [x] Implement responsive design
- [x] Add loading states
- [x] Implement error handling
- [ ] Add drag-and-drop support
- [ ] Improve mobile navigation

### 5. Testing & Deployment (Pending)
- [ ] Write unit tests
- [ ] Perform integration testing
- [ ] Deploy to Vercel
- [ ] Set up production database
- [ ] Configure production monitoring

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