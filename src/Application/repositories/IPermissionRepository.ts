import { Identifier } from '../../../Utils/Generics';
import { Permission } from '../../Domain/aggregates/permissionAggregate/Permission';

export interface IPermissionRepository {
  findAll(): Promise<Permission[]>;

  findByName(name: string): Promise<Permission | null>;

  findById(id: Identifier): Promise<Permission | null>;

  save(permission: Permission): Promise<void>;

  saveMany(permissionList: Permission[]): Promise<void>;
}
