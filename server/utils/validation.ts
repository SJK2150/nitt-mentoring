import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  password: z.string().min(1).max(100),
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  password: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  level: z.number().int().min(0).max(3),
  name: z.string().min(1).max(100).trim().optional(),
  department: z.string().optional(),
});

export const createStudentSchema = z.object({
  regno: z.string().min(1).max(20).trim(),
  name: z.string().min(1).max(100).trim(),
  year: z.enum(['UG', 'PG']),
  section: z.string().max(10).optional(),
  batch: z.number().int().optional(),
  department: z.string().min(1),
  password: z.string().min(8).max(100),
  ugCGPA: z.number().optional(),
  gateScore: z.number().optional(),
  workExperience: z.string().optional(),
});

export const passwordResetSchema = z.object({
  username: z.string().min(3).max(50).trim(),
});

export const passwordResetVerifySchema = z.object({
  username: z.string().min(3).max(50).trim(),
  code: z.string().length(6).regex(/^\d+$/, 'Code must be 6 digits'),
  newPassword: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updatePasswordSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updateMentorSchema = z.object({
  mentor_id: z.number().int(),
});

export const editUserSchema = z.object({
  username: z.string().min(3).max(50).trim().optional(),
  level: z.number().int().min(0).max(3).optional(),
  name: z.string().min(1).max(100).trim().optional(),
  password: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
});

export const createFacultySchema = z.object({
  faculty_id: z.string().min(1).max(20).trim(),
  username: z.string().min(3).max(50).trim(),
  password: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  level: z.number().int().min(1).max(3).optional(), // Faculty level 1, HOD level 2, Admin level 3
  name: z.string().min(1).max(100).trim(),
  department: z.string().min(1),
});

export const createMeetingSchema = z.object({
  student_regno: z.string().min(1).max(20).trim(),
  mentor_id: z.number().int(),
  date: z.string(), // Date as ISO string
  topics_discussed: z.string().optional(),
  concerns: z.string().optional(),
  action_items: z.string().optional(),
});

export const updateMeetingSchema = z.object({
  meeting_id: z.number().int(),
  topics_discussed: z.string().optional(),
  concerns: z.string().optional(),
  action_items: z.string().optional(),
});

export const deleteUserSchema = z.object({
  userId: z.number().int(),
});
