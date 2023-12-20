import { Router } from 'express';
import { IRoutes } from './IRoutes';
import { IUseCasesInstances } from '../../Config/UseCasesManager';

export class UserOpenRoutes implements IRoutes {
  private useCasesInstances: IUseCasesInstances;

  constructor(useCasesInstances: IUseCasesInstances) {
    this.useCasesInstances = useCasesInstances;
  }

  create(): Router {
    const route = Router();

    route.get('/register', async (req, res) => {
      return res.redirect('/web/register');
    });

    route.post('/register', async (req, res) => {
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

    route.get('/login', async (req, res) => {
      return res.redirect('/web/login');
    });

    route.post('/client-login', async (req, res) => {
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
