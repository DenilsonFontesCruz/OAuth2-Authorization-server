import { DomainEvent } from '../domain/DomainEvent';
import { IEventHandler } from './IEventHandler';

export interface IEventDispatcher {
  register(eventName: string, handler: IEventHandler): void;
  notify(event: DomainEvent): void;
}
