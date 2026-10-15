import { z } from "zod";

export const landlordRegistrationValidationSchema = z.object({
  user: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    
    contactNumber: z
      .string()
      .min(1, "Contact number is required")
      .regex(
        /^(?:\+8801|8801|01)[3-9]\d{8}$/,
        "Invalid Bangladeshi contact number"
      ),
  }),

  landlord: z.object({
    address: z
      .string()
      .min(5, "Address must be at least 5 characters long"),
    
    nidOrPassportNumber: z
      .string()
      .min(10, "NID or Passport number must be at least 10 characters")
      .max(17, "NID or Passport number cannot exceed 17 characters")
      .regex(/^[A-Za-z0-9]+$/, "Must contain only letters and numbers"),
  }),
});

