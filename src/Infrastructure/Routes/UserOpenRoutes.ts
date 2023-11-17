import { Router } from 'express';
import { IRoutes } from './IRoutes';
import path from 'path';
import { IUseCasesInstances } from '../../config/UseCasesManager';

export class UserOpenRoutes implements IRoutes {
  private useCasesInstances: IUseCasesInstances;

  constructor(useCasesInstances: IUseCasesInstances) {
    this.useCasesInstances = useCasesInstances;
  }

  create(): Router {
    const route = Router();

    route.get('/register', async (req, res) => {
      return res.sendFile(path.join(__dirname, '../../Presentation/Register'));
    });

    route.post('/register', async (req, res) => {
      /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Create a new user.',
                required: 'true',
                schema: {
                    $email: 'John@gmail.com',
                    $password: 'John1234'
                }
        } */

      try {
        const { email, password } = req.body;

        console.log(req);

        const result = await this.useCasesInstances.createUser.execute({
          email,
          password,
        });

        if (result.isFailure) {
          return res.json(result.errorValue());
        }

        return res.json(result.getValue());
      } catch (err) {
        return res.json(err);
      }
    });

    route.get('/client-login', async (req, res) => {
      return res.sendFile(path.join(__dirname, '../../Presentation/Login'));
    });

    route.post('/client-login', async (req, res) => {
      /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Client login.',
                required: 'true',
                schema: {
                    $email: 'John@gmail.com',
                    $password: 'John1234'
                }
        } */

      try {
        const { email, password } = req.body;

        const result = await this.useCasesInstances.clientLogin.execute({
          email,
          password,
        });

        if (result.isFailure) {
          return res.json(result.errorValue());
        }

        return res.json(result.getValue());
      } catch (err) {
        return res.json(err);
      }
    });

    route.post('/token-login', async (req, res) => {
      /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Token login.',
                required: 'true',
                schema: {
                    $refreshToken: 'token',
                }
        } */

      try {
        const { refreshToken } = req.body;

        const result = await this.useCasesInstances.tokenLogin.execute({
          refreshToken,
        });

        if (result.isFailure) {
          return res.json(result.errorValue());
        }

        return res.json(result.getValue());
      } catch (err) {
        return res.json(err);
      }
    });

    return route;
  }
}
