import { z } from "zod";

export const companyAdminValidation = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    companyPosition: z.string().min(3),
});
export const companyAdminValidationOptional = companyAdminValidation.partial();




