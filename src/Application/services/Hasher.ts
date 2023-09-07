import bcrypt from 'bcrypt';
import { IHasher } from '../tools/IHasher';

export class Hasher implements IHasher {
  async encrypt(text: string, salt: number): Promise<string> {
    try {
      return await bcrypt.hash(text, salt);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //eslint-disable-next-line
  compare(text: string, hashedText: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
