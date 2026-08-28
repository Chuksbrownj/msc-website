/**
 * MSC Website — Request Validation Schemas
 *
 * Uses Zod for type-safe validation of API inputs.
 * Server-side only — never import in client components.
 */

import { z } from "zod";

// Allowed service options (must match SERVICES in constants.ts)
const ALLOWED_SERVICES = [
  "Software Engineering",
  "AI Automation",
  "Workflow Automation",
  "Data Analysis",
  "API & System Integration",
  "Custom Software",
] as const;

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254, "Email must be 254 characters or fewer")
    .email("Please provide a valid email address"),
  company: z
    .string()
    .trim()
    .max(150, "Company must be 150 characters or fewer")
    .optional()
    .or(z.literal(""))
    .transform((val) => val || undefined),
  service: z
    .string()
    .trim()
    .min(1, "Service is required")
    .refine(
      (val) => (ALLOWED_SERVICES as readonly string[]).includes(val),
      "Please select a valid service option"
    ),
  message: z
    .string()
    .trim()
    .min(1, "Project description is required")
    .max(3000, "Project description must be 3000 characters or fewer"),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

export { ALLOWED_SERVICES };
