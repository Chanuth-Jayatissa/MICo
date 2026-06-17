# MICo

MICo is a Michigan-focused career opportunity platform that helps users turn a resume into better job matches, event recommendations, networking actions, and outreach drafts. It combines a Next.js app, Supabase-backed auth/data, and AI-assisted workflows for parsing resumes and generating career support content.

## Features

- Resume upload and parsing workflow for extracting skills and profile context.
- Job matching engine that compares user skills against role requirements with alias-aware skill matching.
- Event relevance scoring based on user industry alignment.
- AI-assisted pitch drafting, event summaries, job matching, and resume parsing API routes.
- Dashboard, jobs, events, networking, referrals, and profile sections.
- Supabase authentication and database schema included in supabase/schema.sql.

## Tech Stack

- Next.js 16 and React 19
- TypeScript
- Supabase SSR and Supabase JS
- Tailwind CSS
- AI SDK with OpenRouter support
- PDF parsing with pdf-parse

## Project Structure

- src/app/(app) - authenticated dashboard, jobs, events, network, and profile pages
- src/app/api/agents - AI-assisted workflows for resume parsing, pitch drafting, job matching, and event summaries
- src/lib/matching/engine.ts - skill and event matching logic
- src/lib/supabase - Supabase client/server helpers
- supabase/schema.sql - database schema

## Getting Started

Install dependencies and start the local dev server:

~~~bash
npm install
npm run dev
~~~

Open the app at http://localhost:3000.

Create a local environment file with the required Supabase values and optional AI provider key:

~~~bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_key
~~~

## Useful Commands

~~~bash
npm run dev
npm run build
npm run start
npm run lint
~~~

## Status

Active portfolio project. The current repo includes the core app shell, matching logic, mock data, AI API routes, and Supabase integration points.
