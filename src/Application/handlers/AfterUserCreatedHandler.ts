import { DomainEvent } from '../../../Domain-Driven-Design-Types/domain/DomainEvent';
import { IEventHandler } from '../../../Domain-Driven-Design-Types/application/IEventHandler';
import { UserCreatedEvent } from '../../Domain/aggregates/userAggregate/events/UserCreatedEvent';

export class AfterUserCreatedHandler implements IEventHandler<DomainEvent> {
  handle(event: UserCreatedEvent): void {
    console.log('AfterUserCreatedHandler:', event);
  }
}
