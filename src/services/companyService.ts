import { CompanyDataRepository } from "../repository/companyRepository";
import { CompanyDataType, CompanyDataTypeOptional } from "../types/companyDataTypes";

export class CompanyService {
  private companyRepository = new CompanyDataRepository();
  public async getCompanyData() {
    return this.companyRepository.findAllData();
  }
  public async getCompanyDataById(id: string) {
    return this.companyRepository.findDataById(id);
  }
  public async addCompanyData(data: CompanyDataType) {
    return this.companyRepository.addData(data);
  }
  public async updateCompanyData(data: CompanyDataTypeOptional, id: string) {
    return this.companyRepository.updateData(data, id);
  }
  public async deleteCompanyData(id: string) {
    return this.companyRepository.deleteData(id);
  }
}
