import { Nothing } from '../../shared/types/nothing';
import { Chyper, ICrypter } from './ICrypter';

export class CrypterTest implements ICrypter {
  constructor() {}

  async encrypt(text: string, cypher?: Chyper): Promise<string | Nothing> {
    let textArray = text.split('');
    const cypherArray = cypher.secret.split('');
    cypherArray.forEach((c, index) => {
      textArray.splice(index * 2, 0, c);
    });
    for (let i = 0; i < cypher.salt; i++) {
      textArray.push(textArray.shift());
    }
    const encryptedText = textArray
      .join('')
      .concat('-', cypher.secret)
      .concat('-', cypher.salt.toString());

    return encryptedText;
  }

  async compare(text: string, hashedText: string): Promise<boolean> {
    const [hash, secret, salt] = hashedText.split('-');
    const hashText = await this.encrypt(text, {
      salt: Number.parseInt(salt),
      secret,
    });

    return hashText === hashedText;
  }
}
