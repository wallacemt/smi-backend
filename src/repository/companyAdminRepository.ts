import { prisma } from "../prisma/prismaClient";
import { AdminDataRequest, AdminDataUpdateRequest } from "../types/companyAdminTypes";

export class CompanyAdminRepository {
  async findByEmail(email: string) {
    return await prisma.companyAdmin.findFirst({
      where: {
        email,
      },
    });
  }
  async findById(id: string) {
    return await prisma.companyAdmin.findFirst({
      where: {
        id,
      },
    });
  }

  async createCompanyAdmin(adminData: AdminDataRequest) {
    return await prisma.companyAdmin.create({
      data: { ...adminData },
    });
  }

  async updateOwner(adminData: AdminDataUpdateRequest, adminId: string) {
    return await prisma.companyAdmin.update({
      where: { id: adminId },
      data: { ...adminData },
    });
  }
}
