import express from 'express';
import { UserOpenRoutes } from './Infrastructure/Routes/UserOpenRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { UserCloseRoutes } from './Infrastructure/Routes/UserCloseRoutes';
import { IUseCasesInstances } from './Config/UseCasesManager';
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

    app.use(bodyParser.json());
    app.use(cors());
    app.use('/web', express.static(path.join(__dirname, '/Presentation')));
    app.use(userOpenRoutes.create());
    app.use('/user', getBearerToken, userCloseRoutes.create());

    app.get('/', (req, res) => {
      res.send('System Online');
    });

    app.listen(this.port, () => {
      console.log('Server is Running on port:', this.port);
    });
  }
}
