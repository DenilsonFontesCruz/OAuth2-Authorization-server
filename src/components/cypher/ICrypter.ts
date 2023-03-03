import { Nothing } from '../../shared/types/nothing';

export interface Chyper {
  salt: number;
  secret: string;
}

export interface ICrypter {
  encrypt(text: string, cypher?: Chyper): Promise<string | Nothing>;

  compare(text: string, hashedText: string): Promise<boolean>;
}
