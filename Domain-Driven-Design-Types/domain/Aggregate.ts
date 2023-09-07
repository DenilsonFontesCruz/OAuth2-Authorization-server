import { Identifier } from '../Generics';
import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot<PropsT> extends Entity<PropsT> {
  private _domainEvents: DomainEvent[] = [];

  get id(): Identifier {
    return this._id;
  }

  public AddDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public RemoveDomainEvent(event: DomainEvent): void {
    const index = this._domainEvents.findIndex((value) => {
      return JSON.stringify(value) == JSON.stringify(event);
    });
    if (index != -1) {
      this._domainEvents.splice(index, 1);
    }
  }

  public ClearDomainEvent(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
