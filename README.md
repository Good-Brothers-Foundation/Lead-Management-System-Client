# Lead Management System (LMS)

A simple Lead Management System built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Dashboard Overview
- Analytics
- Lead Management
  - All Leads
  - New Leads
  - Qualified Leads
- Follow Ups
  - Today's Follow Ups
  - Upcoming Follow Ups
- Tasks
  - My Tasks
  - Pending Tasks
  - Completed Tasks
- Collapsible Sidebar
- Responsive Design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## Installation

```bash
git clone <repository-url>
cd lead-management-system
npm install
npm run dev
```

## Project Structure

```txt
src/
├── app/
│   ├── dashboard/
│   ├── leads/
│   ├── follow-ups/
│   └── tasks/
│
├── components/
│   └── ui/
│
├── lib/
│   └── data.ts
│
└── app/layout.tsx
```

## Routes

```txt
/dashboard
/dashboard/analytics

/leads/all
/leads/new
/leads/qualified

/follow-ups/today
/follow-ups/upcoming

/tasks/my
/tasks/pending
/tasks/completed
```

## Getting Started

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## License

This project is for learning and development purposes.