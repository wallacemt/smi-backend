import { z } from "zod";
import { companyDataValidation } from "../validations/companyDataValidation";

export type CompanyDataType = z.infer<typeof companyDataValidation>;
export type CompanyDataTypeOptional = z.infer<typeof companyDataValidation>;
