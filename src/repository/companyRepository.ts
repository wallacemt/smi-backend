import { prisma } from "../prisma/prismaClient";
import { CompanyDataType, CompanyDataTypeOptional } from "../types/companyDataTypes";

export class CompanyDataRepository {
  async findAllData() {
    return await prisma.companyData.findMany();
  }

  async findDataById(companyId: string) {
    return await prisma.companyData.findUnique({ where: { id: companyId } });
  }
  async addData(companyId: CompanyDataType) {
    return await prisma.companyData.create({ data: { ...companyId } });
  }
  async updateData(companyData: CompanyDataTypeOptional, companyId: string) {
    return await prisma.companyData.update({ where: { id: companyId }, data: { ...companyData } });
  }

  async deleteData(companyId: string) {
    return await prisma.companyData.delete({ where: { id: companyId } });
  }
}
