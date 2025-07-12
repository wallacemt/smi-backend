import { z } from "zod";
import { companyAdminValidation, companyAdminValidationOptional } from "../validations/companyAdminValidation";

export type AdminDataRequest = z.infer<typeof companyAdminValidation>;

export type AdminDataUpdateRequest = z.infer<typeof companyAdminValidationOptional>;

export interface AdminDataResponse {
  id: string;
  name: string;
  email: string;
  companyPosition: string;
  token?: string;
}

export interface AdminDataResponseResume {
  id: string;
  name: string;
  companyPosition: string;
  token:string
}