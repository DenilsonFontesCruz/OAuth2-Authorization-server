import { DomainEvent } from '../domain/DomainEvent';

export interface IEventHandler<EventT extends DomainEvent = DomainEvent> {
  handle(event: EventT): void;
}
