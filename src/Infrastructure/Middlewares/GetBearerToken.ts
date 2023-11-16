import { NextFunction, Request, Response } from 'express';
import { MiddlewareFunction } from './IMiddlewares';

const getBearerToken: MiddlewareFunction = async function (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  try {
    const { authorization } = req.headers;

    const acessToken = authorization?.split(' ')[1] as string;

    req.body.acessToken = acessToken;

    next();
  } catch (err) {
    return res.json(err);
  }
};

export default getBearerToken;
