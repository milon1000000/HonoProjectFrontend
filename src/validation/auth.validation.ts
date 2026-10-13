import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
    .regex(/[0-9]/, "Password must contain at least 1 Number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 Special Character",
    ),
});

export const tenantRegistrationSchema = z.object({
  name: z
    .string("Name must be a string!")
    .trim()
    .min(3, "Name must be at least 3 characters long!")
    .max(50, "Name must be at most 50 characters long!"),
  email: z.email("Please provide a valid email!").toLowerCase(),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
    .regex(/[0-9]/, "Password must contain at least 1 Number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 Special Character",
    ),
  tenant: z.object({
    contactNumber: z
      .string("Contact number is required")
      .trim()
      .regex(
        /^(?:\+?880|0)1[3-9]\d{8}$/,
        "Please provide a valid Bangladeshi number",
      ),
    address: z
      .string("Address must be a string")
      .trim()
      .min(5, "Address must be at least 5 characters long!")
      .max(200, "Address must be at most 200 characters long!")
      .optional(),
  }),
});

