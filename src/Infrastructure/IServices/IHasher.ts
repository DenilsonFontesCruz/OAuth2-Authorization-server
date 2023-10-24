export interface IHasher {
  readonly salt: number;

  encrypt(text: string): Promise<string>;

  compare(text: string, hashedText: string): Promise<boolean>;
}
