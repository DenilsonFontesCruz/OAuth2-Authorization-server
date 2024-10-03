import { DomainEvent } from '../../../../../Utils/domain/DomainEvent';
import { Permission } from '../Permission';

export class PermissionCreatedEvent implements DomainEvent {
  dateTimeOccured: Date;
  eventData: Permission;

  constructor(eventData: Permission) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
