-- MSC Website — Migration 0001: Initial schema (PostgreSQL)
-- Creates the contact_submissions table for project inquiry handling.

CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email for lookup/filtering by contact
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions (email);

-- Index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);

-- Index on service for filtering by service type
CREATE INDEX IF NOT EXISTS idx_contact_submissions_service ON contact_submissions (service);
