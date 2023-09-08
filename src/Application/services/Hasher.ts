import bcrypt from 'bcrypt';
import { IHasher } from '../tools/IHasher';

export class Hasher implements IHasher {
  readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async encrypt(text: string): Promise<string> {
    try {
      return await bcrypt.hash(text, this.salt);
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
