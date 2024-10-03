export interface IUseCase<In, Out> {
  execute(input?: In): Promise<Out>;
}
