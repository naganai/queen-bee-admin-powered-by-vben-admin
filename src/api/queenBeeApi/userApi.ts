import { httpPost, httpGet, httpDelete } from '@/utils/http/request/request';
import { UserDto, NewUserDto as RegisterDto } from '@/models/DTOs/userDto';
import { PagedList } from '@/models/responses/pagedList';
import UserInfoDto from '@/models/DTOs/userInfoDto';
import { ProductionProjectDto } from '@/models/DTOs/productionProjectDto';

const USER_API = {
  REGISTER_USER: '/users/register',
  GET_USER: (userId: number) => `/users/${userId}`,
  DELETE_USER: (userId: number) => `/users/${userId}`,
  SEARCH_USERS: '/users',
};

const USER_INFO_API = {
  GET_USER_INFO: (userId: number) => `/users/${userId}/info`,
  SAVE_USER_INFO: (userId: number) => `/users/${userId}/info`,
};

const USER_PRODUCTION_PROJECT_API = {
  ADD_PRODUCTION_PROJECT: (userId: number, projectId: number) =>
    `/users/${userId}/production-projects/${projectId}`,
  REMOVE_PRODUCTION_PROJECT: (userId: number, projectId: number) =>
    `/users/${userId}/production-projects/${projectId}`,
  GET_USER_PRODUCTION_PROJECTS: (userId: number) => `/users/${userId}/production-projects`,
};

export default class UserApi {
  /**
   * Registers a new user.
   * @param userRegisterDto - The data of the new user to be registered.
   */
  static async register(userRegisterDto: RegisterDto): Promise<UserDto> {
    return await httpPost(USER_API.REGISTER_USER, userRegisterDto);
  }

  /**
   * Retrieves a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns The user data.
   */
  static async getById(userId: number): Promise<UserDto> {
    const url = USER_API.GET_USER(userId);
    return await httpGet(url);
  }

  /**
   * Searches for users based on the specified criteria.
   * @param pageIndex - The index of the page to retrieve (default: 1).
   * @param pageSize - The number of users to retrieve per page (default: 10).
   * @param keywords - The keywords to search for (default: '').
   * @returns A paged list of users.
   */
  static async search(
    pageIndex: number = 1,
    pageSize: number = 10,
    keywords: string = '',
  ): Promise<PagedList<UserDto>> {
    const params = {
      pageIndex,
      pageSize,
      keywords,
    };
    return await httpGet(USER_API.SEARCH_USERS, params);
  }

  /**
   * Deletes a user by ID.
   * @param userId - The ID of the user to delete.
   */
  static async delete(userId: number): Promise<void> {
    const url = USER_API.DELETE_USER(userId);
    await httpDelete(url);
  }

  /**
   * Retrieves the user information by their ID.
   * @param userId - The ID of the user.
   * @returns The user information.
   */
  static async getUserInfo(userId: number): Promise<UserInfoDto> {
    const url = USER_INFO_API.GET_USER_INFO(userId);
    return await httpGet(url);
  }

  /**
   * Saves the user information.
   * @param userId - The ID of the user.
   * @param userInfoDto - The user information DTO.
   * @returns The save result.
   */
  static async saveUserInfo(userId: number, userInfoDto: UserInfoDto): Promise<void> {
    const url = USER_INFO_API.SAVE_USER_INFO(userId);
    await httpPost(url, userInfoDto);
  }

  /**
   * Adds a production project to a user.
   * @param userId - The ID of the user.
   * @param projectId - The ID of the project.
   * @returns The result of adding the production project to the user.
   */
  static async addProductionProject(userId: number, projectId: number): Promise<void> {
    const url = USER_PRODUCTION_PROJECT_API.ADD_PRODUCTION_PROJECT(userId, projectId);
    await httpPost(url);
  }

  /**
   * Removes a production project from a user.
   * @param userId - The ID of the user.
   * @param projectId - The ID of the project.
   * @returns The result of removing the production project from the user.
   */
  static async removeProductionProject(userId: number, projectId: number): Promise<void> {
    const url = USER_PRODUCTION_PROJECT_API.REMOVE_PRODUCTION_PROJECT(userId, projectId);
    await httpDelete(url);
  }

  /**
   * Retrieves the list of production projects owned by a user.
   * @param userId - The ID of the user.
   * @returns The list of production projects owned by the user.
   */
  static async getAllProductionProject(userId: number): Promise<ProductionProjectDto[]> {
    const url = USER_PRODUCTION_PROJECT_API.GET_USER_PRODUCTION_PROJECTS(userId);
    return await httpGet(url);
  }
}
