export interface IJwtManager<payloadT> {
  readonly _secret: string;

  sign(payload: payloadT, duration?: number): string;

  
  verify(token: string): {payload: payloadT, issuedAt: number, expiresAt?: number};
}
