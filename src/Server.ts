import { IDependencies } from './config/Dependencies/IDependencies';
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import swaggerDoc from './config/swagger.json';
import { UserOpenRoutes } from './Infrastructure/Routes/UserOpenRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { UserCloseRoutes } from './Infrastructure/Routes/UserCloseRoutes';
import { IUseCasesInstances } from './config/UseCasesManager';
import getBearerToken from './Infrastructure/Middlewares/GetBearerToken';

export class Server {
  private useCasesInstances: IUseCasesInstances;
  port: number;

  constructor(useCasesInstances: IUseCasesInstances, port: number) {
    this.useCasesInstances = useCasesInstances;
    this.port = port;
  }

  async start(): Promise<void> {
    const app = express();

    const userOpenRoutes = new UserOpenRoutes(this.useCasesInstances);
    const userCloseRoutes = new UserCloseRoutes(this.useCasesInstances);

    console.log(__dirname + '/src/Presentation');

    app.use(bodyParser.json());
    app.use(cors());
    app.use('/web', express.static(path.join(__dirname, '/Presentation')));
    app.use('/docs', serve, setup(swaggerDoc));
    app.use(userOpenRoutes.create());
    app.use('/user', getBearerToken, userCloseRoutes.create());

    app.get('/', (req, res) => {
      res.send('Say My Name');
    });

    app.listen(this.port, () => {
      console.log('Server is Running on port:', this.port);
    });
  }
}
