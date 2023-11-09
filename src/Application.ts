import { IDependencies } from './config/Dependencies/IDependencies';

export class Application {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async start(): Promise<void> {
    console.log(this.dependencies);
  }
}
