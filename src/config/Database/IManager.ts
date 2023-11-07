export interface IManagerResult<T> {
  name: string;
  connection: boolean;
  value?: T;
}
export interface IManager<configT, T = undefined> {
  config: configT;
  start(): Promise<IManagerResult<T>>;
  close(): Promise<boolean>;
}
