import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DefaultPermissions } from '../../../../Utils/constantes/DefaultPermissions';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { Identifier } from '../../../../Utils/Generics';
import { Result } from '../../../../Utils/Result';
import {
  PermissionNotFoundError,
  UserNotFound,
} from '../../errors/ClientErrors';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { VerifyAuth } from '../Auth/VerifyAuth';

interface RevokePermissionInput {
  permissionId: Identifier;
  userId: Identifier;
  acessToken: string;
}

type RevokePermissionOutput = Result<DomainError> | Result<string>;

export class RevokePermission
  implements IUseCase<RevokePermissionInput, RevokePermissionOutput>
{
  private verifyAuth: VerifyAuth;
  private userRepo: IUserRepository;
  private permissionRepo: IPermissionRepository;

  constructor(
    verifyAuth: VerifyAuth,
    userRepo: IUserRepository,
    permissionRepo: IPermissionRepository,
  ) {
    this.verifyAuth = verifyAuth;
    this.userRepo = userRepo;
    this.permissionRepo = permissionRepo;
  }

  async execute(input: RevokePermissionInput): Promise<RevokePermissionOutput> {
    const result = await this.verifyAuth.execute({
      acessToken: input.acessToken,
      permissions: [DefaultPermissions.ADMIN_TI]
    });

    if (result.isFailure) {
      return result as Result<DomainError>;
    }

    const user = await this.userRepo.findById(input.userId);

    if (!user) {
      return UserNotFound.create(`User with id: ${input.userId} not found`);
    }

    const permissionExist = await this.permissionRepo.findById(
      input.permissionId,
    );

    if (!permissionExist) {
      return PermissionNotFoundError.create(
        `Permission with id: ${input.permissionId} not found`,
      );
    }

    const hasPermission = user.removePermission(input.permissionId);

    if (!hasPermission) {
      return PermissionNotFoundError.create(
        `Permission with id: ${input.permissionId} not found`,
      );
    }

    try {
      await this.userRepo.save(user);

      return Result.ok('Permission revoked');
    } catch (error) {
      console.log('Create Permission catch:', error);
      throw error;
    }
  }
}
