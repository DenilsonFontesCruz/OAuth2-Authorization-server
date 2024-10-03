import { v4 as uuidv4 } from 'uuid';
import { Result } from '../../../../Utils/Result';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import {
  Permission,
  PermissionStatus,
} from '../../../Domain/aggregates/permissionAggregate/Permission';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { VerifyAuth } from '../Auth/VerifyAuth';
import { DefaultPermissions } from '../../../../Utils/constantes/DefaultPermissions';
import { PermissionAlredyRegisteredError } from '../../errors/ClientErrors';

interface CreatePermissionInput {
  name: string;
  acessToken: string;
}

type CreatePermissionOutput = Result<DomainError> | Result<string>;

export class CreatePermission
  implements IUseCase<CreatePermissionInput, CreatePermissionOutput>
{
  private verifyAuth: VerifyAuth;
  private permissionRepo: IPermissionRepository;

  constructor(
    verifyAuth: VerifyAuth,
    permissionRepo: IPermissionRepository,
  ) {
    this.verifyAuth = verifyAuth;
    this.permissionRepo = permissionRepo;
  }

  async execute(input: CreatePermissionInput): Promise<CreatePermissionOutput> {
    const result = await this.verifyAuth.execute({
      acessToken: input.acessToken,
      permissions: [DefaultPermissions.ADMIN_TI]
    });

    if (result.isFailure) {
      return result as Result<DomainError>;
    }

    if (await this.permissionRepo.findByName(input.name)) {
      return PermissionAlredyRegisteredError.create(
        `${input.name} permission alredy exists`,
      );
    }

    try {
      const permissionOrError = Permission.create({
        name: input.name,
        status: PermissionStatus.Enabled,
      }, uuidv4());

      if (permissionOrError.isFailure) {
        return permissionOrError.errorValue() as Result<DomainError>;
      }
      await this.permissionRepo.save(
        permissionOrError.getValue() as Permission,
      );

      return Result.ok<string>('Permission created');
    } catch (error) {
      console.log('Create Permission catch:', error);
      throw error;
    }
  }
}
