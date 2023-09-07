import { DomainEvent } from '../../../../../Domain-Driven-Design-Types/domain/DomainEvent';
import { User } from '../User';

export class UserCreatedEvent implements DomainEvent {
  dateTimeOccured: Date;
  eventData: User;

  constructor(eventData: User) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
