import { httpPost, httpGet, httpDelete, httpPut } from '@/utils/http/request/request';
import { ProductionProjectDto, NewProductionProjectDto } from '@/models/DTOs/productionProjectDto';

const Api = {
  POST_PRODUCTION_PROJECT: '/production-projects',
  GET_PRODUCTION_PROJECTS: '/production-projects',
  PUT_PRODUCTION_PROJECT: (projectId: number) => `/production-projects/${projectId}`,
  DELETE_PRODUCTION_PROJECT: (projectId: number) => `/production-projects/${projectId}`,
  GET_PRODUCTION_PROJECT_BY_ID: (projectId: number) => `/production-projects/${projectId}`,
  GET_PRODUCTION_PROJECT_BY_NAME: '/production-projects/by-name',
};

export default class productionProjectApi {
  /**
   * Add a new production project
   * @param newProductionProjectDto The new production project DTO
   * @returns The production project DTO
   */
  static async add(
    newProductionProjectDto: NewProductionProjectDto,
  ): Promise<ProductionProjectDto> {
    return await httpPost(Api.POST_PRODUCTION_PROJECT, newProductionProjectDto);
  }

  /**
   * Update a production project by ID
   * @param projectId The project ID
   * @param productionProjectDto The production project DTO
   * @returns The production project DTO
   */
  static async update(
    projectId: number,
    productionProjectDto: ProductionProjectDto,
  ): Promise<ProductionProjectDto> {
    const url = Api.PUT_PRODUCTION_PROJECT(projectId);
    return await httpPut(url, productionProjectDto);
  }

  /**
   * Delete a production project by ID
   * @param projectId The project ID
   */
  static async delete(projectId: number): Promise<void> {
    const url = Api.DELETE_PRODUCTION_PROJECT(projectId);
    return await httpDelete(url);
  }

  /**
   * Get a production project by ID
   * @param projectId The project ID
   * @returns The production project DTO
   */
  static async getById(projectId: number): Promise<ProductionProjectDto> {
    const url = Api.GET_PRODUCTION_PROJECT_BY_ID(projectId);
    return await httpGet(url);
  }

  /**
   * Get a production project by project name
   * @param projectName The project name
   * @returns The production project DTO
   */
  static async getByName(projectName: string): Promise<ProductionProjectDto> {
    const url = Api.GET_PRODUCTION_PROJECT_BY_NAME;
    return await httpGet(url, { name: projectName });
  }

  /**
   * Get all production projects
   * @returns The production project list
   */
  static async getAll(): Promise<ProductionProjectDto[]> {
    return await httpGet(Api.GET_PRODUCTION_PROJECTS);
  }
}
