import { Checker } from '../../../Utils/Checker';
import { Identifier } from '../../../Utils/Generics';
import { IUserRepository } from '../../Application/repositories/IUserRepository';
import { User } from '../../Domain/aggregates/userAggregate/User';
import { userMapper } from '../Mappers/UserMapper';
import { IUserModel, UserModel } from '../Models/UserModel';

export class UserRepositoryMongo implements IUserRepository {
  async saveMany(userList: User[]): Promise<void> {
    try {
      Promise.resolve(
        userList.forEach(async (user) => {
          const userModel = userMapper.toModel(user);
          await userModel.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await UserModel.deleteMany();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findAll(): Promise<User[]> {
    try {
      const userList = (await UserModel.find({})) as IUserModel[];

      if (Checker.isNullOrUndefined(userList)) {
        return [];
      }

      return userList.map((user) => {
        return userMapper.toDomain(user);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findByEmail(email: string): Promise<User[]> {
    try {
      const userList = (await UserModel.find({ email })) as IUserModel[];

      if (Checker.isNullOrUndefined(userList)) {
        return [];
      }

      return userList.map((user) => {
        return userMapper.toDomain(user);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findById(id: Identifier): Promise<User | null> {
    try {
      const user = (await UserModel.findById(id)) as IUserModel;

      if (!user) {
        return null;
      }

      return userMapper.toDomain(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async save(user: User): Promise<void> {
    try {
      const userModel = userMapper.toModel(user);
      await userModel.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
