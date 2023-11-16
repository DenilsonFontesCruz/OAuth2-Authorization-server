import { NextFunction, Request, Response } from 'express';

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

export interface IMiddlewares {
  create(): MiddlewareFunction;
}
