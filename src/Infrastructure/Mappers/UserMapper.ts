import { HydratedDocument } from 'mongoose';
import { IMapper } from '../../../Domain-Driven-Design-Types/infrastructure/IMapper';
import { User } from '../../Domain/aggregates/userAggregate/User';
import { Email } from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import { IUserModel, UserModel } from '../Models/UserModel';

class UserMapper implements IMapper<User, IUserModel> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  toDomain(model: IUserModel): User {
    const email = Email.recovery(model.email);

    return User.recovery({
      id: model._id,
      email: email,
      password: model.password,
    });
  }
  toModel(entity: User): HydratedDocument<IUserModel> {
    return new UserModel({
      id: entity.id,
      email: entity.getEmail().getValue(),
      password: entity.getPassword(),
    });
  }
}

export const userMapper = new UserMapper();
