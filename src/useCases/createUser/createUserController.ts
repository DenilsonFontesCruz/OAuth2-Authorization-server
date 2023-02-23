import * as express from 'express';
import { CreateUser } from './createUser';

export class CreateUserController {
  private useCase: CreateUser;

  constructor(useCase: CreateUser) {
    this.useCase = useCase;
  }

  public async execute(req: express.Request, res: express.Response) {
    const body = req.body;

    const name: string = body.name;
    const email: string = body.email;
    const password: string = body.password;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: `Either 'firstName', 'lastName', 'email' or 'password not present`,
      });
    }

    try {
      const result = await this.useCase.execute({
        name,
        email,
        password,
      });

      return res.status(201).json(result);
    } catch (err) {
      return res.status(500);
    }
  }
}
