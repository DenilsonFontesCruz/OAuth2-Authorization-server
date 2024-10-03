import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DefaultPermissions } from '../../../../Utils/constantes/DefaultPermissions';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { Identifier } from '../../../../Utils/Generics';
import { Result } from '../../../../Utils/Result';
import {
  PermissionNotFoundError,
  UserAlredyHavePermissionError,
  UserNotFound,
} from '../../errors/ClientErrors';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { VerifyAuth } from '../Auth/VerifyAuth';

interface GrantPermissionInput {
  permissionId: Identifier;
  userId: Identifier;
  acessToken: string;
}

type GrantPermissionOutput = Result<DomainError> | Result<string>;

export class GrantPermission
  implements IUseCase<GrantPermissionInput, GrantPermissionOutput>
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

  async execute(input: GrantPermissionInput): Promise<GrantPermissionOutput> {
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

    const permissionAssigned = user.assignPermission(input.permissionId);

    if (!permissionAssigned) {
      return UserAlredyHavePermissionError.create(
        `User with id: ${input.userId} already have permission with id: ${input.permissionId}`,
      );
    }

    try {
      await this.userRepo.save(user);

      return Result.ok('Permission granted');
    } catch (error) {
      console.log('Create Permission catch:', error);
      throw error;
    }
  }
}
