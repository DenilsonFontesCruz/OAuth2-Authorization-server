import {
  Permission,
  PermissionStatus,
} from '../../../Domain/aggregates/permissionAggregate/Permission';

export function createMockPermission(name: string): Permission {
  const result = Permission.create(
    { name, status: PermissionStatus.Enabled },
    '1',
  );
  return result.getValue() as Permission;
}
