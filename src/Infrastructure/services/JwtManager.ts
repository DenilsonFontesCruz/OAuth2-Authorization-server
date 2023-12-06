import jwt, { JwtPayload } from 'jsonwebtoken';
import { IJwtManager } from '../IServices/IJwtManager';

export class JwtManager<payloadT> implements IJwtManager<payloadT> {
  readonly _secret: string;

  constructor(secret: string) {
    this._secret = secret;
  }

  sign(payload: payloadT, duration?: number): string {
    if (duration) {
      return jwt.sign({ payload }, this._secret, {
        expiresIn: `${duration}ms`,
      });
    }
    return jwt.sign({ payload }, this._secret);
  }
  verify(token: string): {
    payload: payloadT;
    issuedAt: number;
    expiresAt?: number;
  } {
    const tokenBody = jwt.verify(token, this._secret, {
      ignoreExpiration: true,
    }) as JwtPayload;

    return {
      payload: tokenBody?.payload as payloadT,
      issuedAt: tokenBody?.iat as number,
      expiresAt: tokenBody?.exp,
    };
  }
}
