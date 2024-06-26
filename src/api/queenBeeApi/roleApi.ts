import { httpGet, httpPost } from '@/utils/http/request/request';
import { RoleDto, NewRoleDto } from '@/models/DTOs/roleDtos';

const Api = {
  ADD_NEW_ROLE: '/roles',
  GET_ALL_ROLES: '/roles',
  DELETE_ROLE: (roleId: number) => `/roles/${roleId}`,
  UPDATE_ROLE: (roleId: number) => `/roles/${roleId}`,
};

export default class RoleApi {
  /**
   * Add a new role
   * @param newRoleDto The new role DTO
   * @returns The role DTO
   */
  static async add(newRoleDto: NewRoleDto): Promise<RoleDto> {
    return await httpPost(Api.ADD_NEW_ROLE, newRoleDto);
  }

  /**
   * Get all roles
   * @returns The role DTOs
   */
  static async getAll(): Promise<RoleDto[]> {
    return await httpGet(Api.GET_ALL_ROLES);
  }

  /**
   * Delete a role by ID
   * @param roleId The role ID
   */
  static async delete(roleId: number): Promise<void> {
    const url = Api.DELETE_ROLE(roleId);
    return await httpGet(url);
  }

  /**
   * Update a role by ID
   * @param roleId The role ID
   * @param roleDto The role DTO
   * @returns The role DTO
   */
  static async update(roleId: number, roleDto: RoleDto): Promise<RoleDto> {
    const url = Api.UPDATE_ROLE(roleId);
    return await httpPost(url, roleDto);
  }
}
