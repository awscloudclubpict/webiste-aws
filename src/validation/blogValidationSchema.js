import { z } from "zod";

const urlRegex =
  /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/i;

// CREATE schema
export const blogValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),

  author_name: z
    .string()
    .min(2, "Author name must be at least 2 characters long")
    .max(50, "Author name cannot exceed 50 characters"),

  author_profile_url: z
    .string()
    .url("Invalid author profile URL")
    .optional()
    .or(z.literal("")),

  thumbnail_image_url: z
    .string()
    .url("Invalid thumbnail image URL")
    .optional()
    .or(z.literal("")),

  short_description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  tags: z
    .string()
    .max(100, "Tags cannot exceed 100 characters")
    .optional(),

  publish_date: z
    .preprocess((arg) => (arg ? new Date(arg) : undefined), z.date().optional()),

  share_url: z
    .string()
    .regex(urlRegex, "Invalid share URL")
    .optional()
    .or(z.literal("")),
});


// UPDATE schema — all fields optional
export const blogUpdateValidationSchema = blogValidationSchema.partial();
