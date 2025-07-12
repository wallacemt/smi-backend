import { Exception } from "../utils/exception";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/hash";
import { ZodError } from "zod";
import { CompanyAdminRepository } from "../repository/companyAdminRepository";
import { AdminDataRequest, AdminDataResponse, AdminDataResponseResume } from "../types/companyAdminTypes";
import { companyAdminValidation } from "../validations/companyAdminValidation";

const jwtSecret = process.env.JWT_SECRET;

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 30 * 60 * 1000;

interface AttemptData {
  attempts: number;
  lastAttempt: number;
}

const attemptsCache: Record<string, AttemptData> = {};
export class AuthService {
  private companyAdminRepository = new CompanyAdminRepository();

  public async registercompanyAdmin(companyAdminData: AdminDataRequest): Promise<AdminDataResponse> {
    if (!companyAdminData) throw new Exception("companyAdmin data e requerido!", 400);
    const companyAdmin = await this.companyAdminRepository.findByEmail(companyAdminData.email);
    if (companyAdmin) throw new Exception("Email ja cadastrado!", 409);

    try {
      companyAdminValidation.parse(companyAdminData);
      const hashedPassword = await hashPassword(companyAdminData.password);
      companyAdminData.password = hashedPassword;
      const result = await this.companyAdminRepository.createCompanyAdmin(companyAdminData);
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        companyPosition: result.companyPosition,
      };
    } catch (e) {
      if (e instanceof ZodError) {
        throw new Exception(e.issues[0].message, 400);
      }
      throw new Exception(`Informe os dados corretamente: ${e}`, 400);
    }
  }

  public async login(email: string, password: string): Promise<AdminDataResponseResume> {
    const companyAdmin = await this.companyAdminRepository.findByEmail(email);

    if (!companyAdmin) throw new Exception("companyAdmin não encontrado!", 404);
    const data = attemptsCache[email] || { attempts: 0, lastAttempt: Date.now() };
    if (data.attempts >= MAX_ATTEMPTS && Date.now() - data.lastAttempt < LOCK_TIME) {
      throw new Exception(
        `Número máximo de tentativas excedido. Tente novamente em ${Math.ceil(
          (LOCK_TIME - Date.now() + data.lastAttempt) / 1000 / 60
        )} minutos`,
        429
      );
    }

    const isValidPassword = await verifyPassword(companyAdmin.password, password);

    if (!isValidPassword) {
      attemptsCache[email] = {
        attempts: data.attempts + 1,
        lastAttempt: Date.now(),
      };

      throw new Exception(`Senha inválida, tentativas restantes: ${MAX_ATTEMPTS - data.attempts}`, 401);
    }

    delete attemptsCache[email];
    const token = jwt.sign({ id: companyAdmin.id, email: companyAdmin.email }, jwtSecret as string, {
      expiresIn: "7d",
    });

    return { id: companyAdmin.id, name: companyAdmin.name, companyPosition: companyAdmin.companyPosition, token };
  }
}
