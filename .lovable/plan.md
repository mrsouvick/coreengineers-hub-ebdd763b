

# CoreEngineers Hub — Implementation Plan

## Brand & Design
- **Dark & techy theme** with dark navy (`#0A1628`) background and vibrant orange (`#FF6B2C`) accents
- Sleek, modern typography with clear visual hierarchy
- Smooth animations and hover effects for a polished, professional feel
- Fully responsive design (mobile, tablet, desktop)

---

## Pages & Features

### 1. Landing Page (Homepage)
- Bold hero section with tagline: *"Your Trusted Academic Companion for MAKAUT Engineering"*
- Animated branch selector cards (ECE, EE, ME, Civil Engineering)
- Key stats section (video count, students helped, subjects covered)
- "How It Works" section explaining the learning path
- Testimonials / student feedback section
- Call-to-action for signup and YouTube channel
- Footer with links, social media, and contact info

### 2. Authentication (Login / Signup)
- Student registration with email & password
- Login page with error handling and validation
- Protected routes — redirect to login if not signed in
- User profiles with name, branch, semester selection

### 3. Branch & Semester Explorer
- Browse by branch → semester → subject → topic
- Clean card-based layout for each level of navigation
- Breadcrumb navigation for easy backtracking
- Search functionality to quickly find subjects or topics

### 4. Subject Learning Page
- Embedded YouTube video player for lectures
- Subject-wise playlist navigation (sidebar or tabs)
- Video progress tracking (mark as watched)
- Related notes and materials shown alongside videos

### 5. Study Materials & Downloads
- Downloadable PDFs: handwritten notes, digital reference sheets, important questions
- Organized by branch → semester → subject
- Preview before download
- Download counter for popular resources

### 6. Revision & Exam Prep Section
- Short revision video playlists
- Important topic highlights per subject
- Exam suggestion sheets and question banks
- Study roadmaps with visual timelines

### 7. Student Dashboard
- Personalized dashboard showing enrolled branch & semester
- Recently watched videos and continue-where-you-left-off
- Bookmarked videos and materials
- Progress tracking per subject (percentage complete)
- Quick access to upcoming exam resources

### 8. Admin Panel
- Admin login with role-based access control
- Manage content: add/edit/delete videos, notes, and materials
- Organize content by branch, semester, and subject
- Upload PDF study materials
- View basic analytics (popular content, active users)

### 9. About Page
- CoreEngineers Hub mission statement and story
- Team section with founder, tutors, and designer
- Vision and future roadmap highlights

### 10. Contact Page
- Contact form for student queries and feedback
- Social media links (YouTube, Instagram, etc.)
- FAQ section for common questions

---

## Backend (Supabase / Lovable Cloud)
- **User authentication** — email/password signup & login
- **Student profiles** — branch, semester, avatar, display name
- **User roles** — separate roles table (admin, student) for secure access control
- **Content database** — branches, semesters, subjects, topics, videos, materials
- **Bookmarks & Progress** — track watched videos and saved content per user
- **File storage** — PDF notes and study materials uploads
- **Admin functionality** — content management with role-protected access

---

## Content Structure
```
Branch (ECE / EE / ME / Civil)
  └── Semester (1st to 8th)
       └── Subject
            └── Topics
                 ├── Video Lectures (YouTube embeds)
                 ├── Notes (PDF downloads)
                 └── Exam Resources
```

This plan will be implemented step-by-step, starting with the core pages and design system, then adding backend functionality, and finally the admin panel and advanced features.

