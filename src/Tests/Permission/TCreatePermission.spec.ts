import { describe, expect, test } from 'vitest';
import { TestDependencies } from '../../Config/Dependencies/TestDependencies';
import { CreatePermission } from '../../Application/useCases/Permission/CreatePermission';
import { VerifyAuth } from '../../Application/useCases/Auth/VerifyAuth';
import { createMockPermission } from '../Mock/tools/CreateMockPermission';
import { UserTokenPayload } from '../../../Utils/UserTokenPayload';
import {
  InvalidCredentialsError,
  TokenNotProvided,
} from '../../Application/errors/ClientErrors';
import { DefaultPermissions } from '../../../Utils/constantes/DefaultPermissions';

const { SERVICES, REPOSITORIES } = TestDependencies;

describe('Create Permission', () => {
  const cacheManager = SERVICES['CacheManager']();
  const jwtManager = SERVICES['JwtManager']<UserTokenPayload>('SECRET');
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

  test('Token not Provided', async () => {
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    jwtManager.sign({ id: '1', permissions: ['USER'] });

    const createPermission = new CreatePermission(verifyAuth, permissionRepo);

    const result = await createPermission.execute({
      name: '',
      acessToken: '',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenNotProvided);
  });

  test('User without ADMIN permission', async () => {
    const permissionRepo = REPOSITORIES['PermissionRepository']();
    await permissionRepo.save(createMockPermission(DefaultPermissions.ADMIN_TI));

    const createPermission = new CreatePermission(verifyAuth, permissionRepo);

    const token = jwtManager.sign({
      id: 'ID',
      permissions: ['USER'],
    });

    const result = await createPermission.execute({
      name: '',
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(InvalidCredentialsError);
  });

  test('Correct data', async () => {
    const permissionRepo = REPOSITORIES['PermissionRepository']();
    await permissionRepo.save(createMockPermission(DefaultPermissions.ADMIN_TI));

    const createPermission = new CreatePermission(verifyAuth, permissionRepo);

    const token = jwtManager.sign({
      id: 'ID',
      permissions: [DefaultPermissions.ADMIN_TI],
    });

    const result = await createPermission.execute({
      name: 'USER',
      acessToken: token,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).not.toBeUndefined();
  });
});
