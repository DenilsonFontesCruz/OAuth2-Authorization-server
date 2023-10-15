import bcrypt from 'bcrypt';
import { IHasher } from '../../Application/IServices/IHasher';

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

  async compare(text: string, hashedText: string): Promise<boolean> {
    try {
      return await bcrypt.compare(text, hashedText);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
