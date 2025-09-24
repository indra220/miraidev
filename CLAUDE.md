# CLAUDE.md - CodeGuide Starter Kit

This file contains essential context about the project structure, technologies, and conventions to help Claude understand and work effectively within this codebase.

## Project Overview

**CodeGuide Starter Kit** is a modern Next.js starter template featuring database integration, AI capabilities, and a comprehensive UI component system.

### Core Technologies

- **Framework**: Next.js 15 with App Router (`/src/app` directory structure)
- **Language**: TypeScript with strict mode enabled
- **Styling**: TailwindCSS v4 with CSS custom properties
- **UI Components**: shadcn/ui (New York style) with Lucide icons
- **Database**: Supabase with integration
- **AI Integration**: Vercel AI SDK with support for Anthropic Claude and OpenAI
- **Theme System**: next-themes with dark mode support

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/          # AI chat endpoint
│   ├── globals.css        # Global styles with dark mode
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with status dashboard
├── components/
│   ├── ui/                # shadcn/ui components (40+ components)
│   ├── chat.tsx           # AI chat interface
│   ├── setup-guide.tsx    # Configuration guide
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Dark mode toggle components
├── lib/
│   ├── utils.ts           # Utility functions (cn, etc.)
│   ├── supabase.ts        # Supabase client configurations
│   └── env-check.ts       # Environment validation
└── middleware.ts          # Middleware for security headers
```

## Key Configuration Files

- **package.json**: Dependencies and scripts
- **components.json**: shadcn/ui configuration (New York style, neutral colors)
- **tsconfig.json**: TypeScript configuration with path aliases (`@/`)
- **.env.example**: Environment variables template

## Database Integration

### Supabase Integration
- **Client**: `createSupabaseClient()` for client-side operations
- **Server Client**: `createSupabaseAdminClient()` for server-side operations

#### Supabase Client Usage Patterns

**Server-side (Recommended for data fetching):**
```typescript
import { createSupabaseAdminClient } from "@/lib/supabase"

export async function getServerData() {
  const supabase = await createSupabaseAdminClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Database error:', error)
    return null
  }
  
  return data
}
```

**Client-side (For interactive operations):**
```typescript
"use client"

import { createSupabaseClient } from "@/lib/supabase"

function ClientComponent() {
  const supabase = createSupabaseClient()

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
    
    return data
  }
}
```

## UI & Styling

### TailwindCSS Setup
- **Version**: TailwindCSS v4 with PostCSS
- **Custom Properties**: CSS variables for theming
- **Dark Mode**: Class-based with `next-themes`
- **Animations**: `tw-animate-css` package included

### shadcn/ui Components
- **Style**: New York variant
- **Theme**: Neutral base color with CSS variables
- **Icons**: Lucide React
- **Components Available**: 40+ UI components (Button, Card, Dialog, etc.)

### Theme System
- **Provider**: `ThemeProvider` in layout with system detection
- **Toggle Components**: `ThemeToggle` (dropdown) and `SimpleThemeToggle` (button)
- **Persistence**: Automatic theme persistence across sessions

### AI Integration
- **Endpoint**: `/api/chat/route.ts`
- **Providers**: Anthropic Claude and OpenAI support
- **Chat Component**: Real-time streaming chat interface

## Development Conventions

### File Organization
- **Components**: Use PascalCase, place in appropriate directories
- **Utilities**: Place reusable functions in `src/lib/`
- **Types**: Define alongside components or in dedicated files
- **API Routes**: Follow Next.js App Router conventions

### Import Patterns
```typescript
// Path aliases (configured in tsconfig.json)
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

// External libraries
import { useTheme } from "next-themes"
```

### Component Patterns
```typescript
// Client components (when using hooks/state)
"use client"

// Server components (default, for data fetching)
export default async function ServerComponent() {
  const user = await getCurrentUser()
  // ...
}
```

## Environment Variables

Required for full functionality:

```bash
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# AI Integration (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Common Patterns

### Row Level Security (RLS) Policies

Database tables can use RLS policies for access control based on application logic.

**Public Read Pattern:**
```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts (public)
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can only update/delete their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

**Public Data Pattern:**
```sql
-- All data is publicly readable
CREATE POLICY "Public read access" ON public_table
  FOR SELECT USING (true);
```

### Database Operations with Supabase

**Complete CRUD Example:**
```typescript
import { createSupabaseAdminClient } from "@/lib/supabase"

// CREATE - Insert new record
export async function createPost(title: string, content: string, userId: string) {
  const supabase = await createSupabaseAdminClient()
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      user_id: userId,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating post:', error)
    return null
  }
  
  return data
}

// READ - Fetch all posts
export async function getPosts() {
  const supabase = await createSupabaseAdminClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      created_at,
      user_id
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  return data
}

// UPDATE - Modify existing record
export async function updatePost(postId: string, updates: { title?: string; content?: string }) {
  const supabase = await createSupabaseAdminClient()
  
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating post:', error)
    return null
  }
  
  return data
}

// DELETE - Remove record
export async function deletePost(postId: string) {
  const supabase = await createSupabaseAdminClient()
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
  
  if (error) {
    console.error('Error deleting post:', error)
    return false
  }
  
  return true
}
```

**Real-time Subscriptions:**
```typescript
"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"

function useRealtimePosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const supabase = createSupabaseClient()
    
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
      
      setPosts(data || [])
    }

    fetchPosts()

    // Subscribe to changes
    const subscription = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        (payload) => {
          fetchPosts() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return posts
}
```

### Route Security
Security for routes can be implemented as needed using Next.js middleware.

### Theme-Aware Components
```typescript
// Automatic dark mode support via CSS custom properties
<div className="bg-background text-foreground border-border">
  <Button variant="outline">Themed Button</Button>
</div>
```

## Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Best Practices

1. **Authentication**: Always check user state with Clerk hooks/utilities
2. **Database**: Use RLS policies with Clerk user IDs for security
3. **UI**: Leverage existing shadcn/ui components before creating custom ones
4. **Styling**: Use TailwindCSS classes and CSS custom properties for theming
5. **Types**: Maintain strong TypeScript typing throughout
6. **Performance**: Use server components by default, client components only when needed

## Integration Notes

- **Clerk + Supabase**: Uses modern third-party auth (not deprecated JWT templates)
- **AI Chat**: Requires authentication and environment variables
- **Dark Mode**: Automatically applied to all shadcn components
- **Mobile**: Responsive design with TailwindCSS breakpoints

This starter kit provides a solid foundation for building modern web applications with authentication, database integration, AI capabilities, and polished UI components.