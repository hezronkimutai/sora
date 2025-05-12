# System Architecture & Patterns

## System Architecture

```mermaid
flowchart TD
    subgraph Client
        UI[React Components]
        SR[Server Routes]
        HC[HTTP Client]
    end

    subgraph Server
        AR[API Routes]
        AUTH[Clerk Auth]
        PM[Prisma Models]
    end

    subgraph External
        S3[AWS S3]
        DB[(PostgreSQL)]
    end

    UI <--> SR
    SR <--> HC
    HC <--> AR
    AR <--> AUTH
    AR <--> PM
    PM <--> DB
    AR <--> S3
```

## Design Patterns

### 1. Frontend Patterns

#### Component Architecture
- **Atomic Design Pattern**
  - Atoms: Basic UI elements (buttons, inputs)
  - Molecules: Combined UI elements (search bars, file cards)
  - Organisms: Complex UI sections (file lists, navigation)
  - Templates: Page layouts
  - Pages: Complete views

#### State Management
- **Server State**: NextJS Server Components
- **Client State**: React Context + Hooks
- **Form State**: React Hook Form

#### Data Fetching
- Server Components for initial data
- React Query for client-side updates
- Optimistic updates for better UX

### 2. Backend Patterns

#### API Architecture
- **RESTful API Design**
  - Resource-based routing
  - Standard HTTP methods
  - Consistent error handling

#### Database Schema
```mermaid
erDiagram
    User ||--o{ Folder : owns
    User ||--o{ File : owns
    Folder ||--o{ File : contains
    Folder ||--o{ Folder : contains

    User {
        string id PK
        string email
        datetime createdAt
    }

    Folder {
        string id PK
        string name
        string userId FK
        string parentId FK
        datetime createdAt
        datetime updatedAt
    }

    File {
        string id PK
        string name
        string type
        string s3Key
        string userId FK
        string folderId FK
        integer size
        datetime createdAt
        datetime updatedAt
    }
```

### 3. Security Patterns

#### Authentication Flow
```mermaid
sequenceDiagram
    Client->>+Clerk: Authentication Request
    Clerk-->>-Client: Auth Token
    Client->>+API: Request with Token
    API->>+Clerk: Verify Token
    Clerk-->>-API: Token Valid
    API-->>-Client: Protected Data
```

#### Authorization Rules
- Role-based access control
- Resource ownership validation
- Route protection middleware

### 4. Storage Patterns

#### File Handling
```mermaid
flowchart LR
    A[Upload Request] --> B{Size Check}
    B -->|Valid| C[Generate S3 URL]
    B -->|Invalid| D[Error Response]
    C --> E[Direct Upload]
    E --> F[Update DB]
```

#### Metadata Management
- Separate metadata from file storage
- Efficient querying patterns
- Cascading deletions

### 5. Error Handling

#### Error Types
- ValidationError
- AuthenticationError
- StorageError
- DatabaseError

#### Error Response Format
```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Performance Patterns

### 1. Caching Strategy
- Server-side caching
- Browser caching
- Static asset optimization

### 2. Loading States
- Skeleton loading
- Progressive loading
- Infinite scroll for large lists

### 3. Optimization Techniques
- Image optimization
- Code splitting
- Lazy loading
- Debounced operations

## Implementation Guidelines

### 1. Code Organization
```
src/
├── app/
│   ├── (auth)/
│   └── (dashboard)/
├── components/
│   ├── ui/
│   └── features/
├── lib/
│   ├── utils/
│   └── db/
└── types/
```

### 2. Naming Conventions
- PascalCase for components
- camelCase for functions/variables
- kebab-case for files/folders
- UPPER_CASE for constants

### 3. Testing Strategy
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical paths