import { describe, expect, test } from 'vitest';
import { TestDependencies } from '../../Config/Dependencies/TestDependencies';
import { UserTokenPayload } from '../../../Utils/UserTokenPayload';
import { VerifyAuth } from '../../Application/useCases/Auth/VerifyAuth';
import { GrantPermission } from '../../Application/useCases/Permission/GrantPermission';
import { InvalidCredentialsError, PermissionNotFoundError, TokenNotProvided, UserNotFound } from '../../Application/errors/ClientErrors';
import { createMockPermission } from '../Mock/tools/CreateMockPermission';
import { DefaultPermissions } from '../../../Utils/constantes/DefaultPermissions';
import { createMockUser } from '../Mock/tools/CreateMockUser';
import { RevokePermission } from '../../Application/useCases/Permission/RevokePermission';

const { SERVICES, REPOSITORIES } = TestDependencies;

describe('Revoke Permission', () => {
  const cacheManager = SERVICES['CacheManager']();
  const jwtManager = SERVICES['JwtManager']<UserTokenPayload>('SECRET');
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

  test('Token not Provided', async () => {
    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    jwtManager.sign({ id: '1', permissions: ['USER'] });

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const result = await revokePermission.execute({
      userId: '',
      permissionId: '',
      acessToken: '',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenNotProvided);
  });

  test('User without ADMIN permission', async () => {
    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const token = jwtManager.sign({
      id: 'ID',
      permissions: ['USER'],
    });

    const result = await revokePermission.execute({
        userId: '',
        permissionId: '',
        acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(InvalidCredentialsError);
  });

  test('User not found', async () => {

    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    const permission = createMockPermission('USER');

    permissionRepo.save(permission);

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const token = jwtManager.sign({
      id: 'ID',
      permissions: [DefaultPermissions.ADMIN_TI],
    });

    const result = await revokePermission.execute({
      userId: 'ID',
      permissionId: permission.id,
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(UserNotFound);
  });

  test('Permission not found', async () => {
    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    const userList = await createMockUser(1);

    userRepo.saveMany(userList);

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const token = jwtManager.sign({
      id: 'ID',
      permissions: [DefaultPermissions.ADMIN_TI],
    });

    const result = await revokePermission.execute({
      userId: userList[0].id,
      permissionId: 'ID',
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(PermissionNotFoundError);
  });

  test('User not have permission', async () => {
    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    const userList = await createMockUser(1);
    const permission = createMockPermission('USER');

    userRepo.saveMany(userList);
    permissionRepo.save(permission);

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const token = jwtManager.sign({
      id: 'ID',
      permissions: [DefaultPermissions.ADMIN_TI],
    });

    const result = await revokePermission.execute({
      userId: userList[0].id,
      permissionId: permission.id,
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(PermissionNotFoundError);
  });

  test('Correct data', async () => {
    const userRepo = REPOSITORIES['UserRepository']();
    const permissionRepo = REPOSITORIES['PermissionRepository']();

    const userList = await createMockUser(1);
    const permission = createMockPermission('USER');

    userList[0].assignPermission(permission.id);

    userRepo.saveMany(userList);
    permissionRepo.save(permission);

    const revokePermission = new RevokePermission(
      verifyAuth,
      userRepo,
      permissionRepo,
    );

    const token = jwtManager.sign({
      id: 'ID',
      permissions: [DefaultPermissions.ADMIN_TI],
    });

    const result = await revokePermission.execute({
      userId: userList[0].id,
      permissionId: permission.id,
      acessToken: token,
    });
    
    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).not.toBeUndefined();
    expect(userList[0].getPermissionsId()).length(0);
  });
});
