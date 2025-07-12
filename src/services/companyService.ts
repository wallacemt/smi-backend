import { CompanyDataRepository } from "../repository/companyRepository";
import { CompanyDataType, CompanyDataTypeOptional } from "../types/companyDataTypes";
import { Exception } from "../utils/exception";
import { companyDataValidation, companyDataValidationOptional } from "../validations/companyDataValidation";

export class CompanyService {
  private companyRepository = new CompanyDataRepository();
  public async getCompanyData() {
    return this.companyRepository.findAllData();
  }
  public async getCompanyDataById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.companyRepository.findDataById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    return this.companyRepository.findDataById(id);
  }
  public async addCompanyData(data: CompanyDataType) {
    companyDataValidation.parse(data);
    return this.companyRepository.addData(data);
  }
  public async updateCompanyData(data: CompanyDataTypeOptional, id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.companyRepository.findDataById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    companyDataValidationOptional.parse(data);
    return this.companyRepository.updateData(data, id);
  }
  public async deleteCompanyData(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.companyRepository.findDataById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    return this.companyRepository.deleteData(id);
  }
}
