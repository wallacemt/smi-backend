import { z } from "zod";

export const companyDataValidation = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export const companyDataValidationOptional = companyDataValidation.partial();
