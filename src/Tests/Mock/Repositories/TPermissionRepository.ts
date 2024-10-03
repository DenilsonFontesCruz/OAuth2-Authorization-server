import { Identifier } from '../../../../Utils/Generics';
import { IPermissionRepository } from '../../../Application/repositories/IPermissionRepository';
import { Permission } from '../../../Domain/aggregates/permissionAggregate/Permission';

export class TPermissionRepository implements IPermissionRepository {
  private permissions: Permission[];

  public constructor(permissions?: Permission[]) {
    if (permissions == undefined) {
      this.permissions = [];
    } else {
      this.permissions = permissions;
    }
  }

  async saveMany(permissionList: Permission[]): Promise<void> {
    this.permissions = [...permissionList, ...this.permissions];
  }

  async findAll(): Promise<Permission[]> {
    return this.permissions;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = this.permissions.find((permission) => {
      return permission.getName() === name;
    });

    if (!permission) {
      return null;
    }

    return permission;
  }

  async findById(id: Identifier): Promise<Permission | null> {
    const permission = this.permissions.find((permission) => {
      return permission.id === id;
    });

    if (!permission) {
      return null;
    }

    return permission;
  }

  async save(permission: Permission): Promise<void> {
    this.permissions.push(permission);
  }
}
