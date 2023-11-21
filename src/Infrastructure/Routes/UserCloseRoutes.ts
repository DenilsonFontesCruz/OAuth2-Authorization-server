import { Router } from 'express';
import { IRoutes } from './IRoutes';
import { IUseCasesInstances } from '../../config/UseCasesManager';

export class UserCloseRoutes implements IRoutes {
  private useCasesInstances: IUseCasesInstances;

  constructor(useCasesInstances: IUseCasesInstances) {
    this.useCasesInstances = useCasesInstances;
  }

  create(): Router {
    const route = Router();

    route.post('/logout', async (req, res) => {
      try {
        const { refreshToken, acessToken } = req.body;

        console.log(acessToken);

        const result = await this.useCasesInstances.logout.execute({
          acessToken,
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
