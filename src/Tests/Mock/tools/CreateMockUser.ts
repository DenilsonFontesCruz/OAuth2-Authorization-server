import { IHasher } from '../../../Infrastructure/IServices/IHasher';
import { User } from '../../../Domain/aggregates/userAggregate/User';
import { Email } from '../../../Domain/aggregates/userAggregate/valueObjects/Email';

export async function createMockUser(
  quantity: number,
  hasher?: IHasher,
): Promise<User[]> {
  const userList: User[] = [];

  for (let index = 1; index <= quantity; index++) {
    const email = Email.create(`user${index}@mock.test`);
    let password = `User${index}test`;

    if (email.isFailure) {
      console.error('CreateMockUser email fail');
      break;
    }

    if (hasher) {
      password = await hasher.encrypt(password);
    }

    const user = User.create({
      id: index.toString(),
      email: email.getValue() as Email,
      password: password,
    });

    if (user.isFailure) {
      console.error('CreateMockUser email fail');
      break;
    }

    userList.push(user.getValue() as User);
  }

  return userList as User[];
}

export function getMockUserRawPassword(index: number): string {
  return `User${++index}test`;
}
