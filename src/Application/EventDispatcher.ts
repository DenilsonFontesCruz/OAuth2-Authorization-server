import { IEventDispatcher } from '../../Utils/application/IEventDispatcher';
import { IEventHandler } from '../../Utils/application/IEventHandler';
import { DomainEvent } from '../../Utils/domain/DomainEvent';

export class EventDispatcher implements IEventDispatcher {
  private eventHandlers: { [eventName: string]: IEventHandler[] } = {};

  getEventHandlers(): { [eventName: string]: IEventHandler[] } {
    return this.eventHandlers;
  }

  register(eventName: string, handler: IEventHandler): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }
  notify(event: DomainEvent): void {
    const eventName = event.constructor.name;
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach((handler) => {
        handler.handle(event);
      });
    }
  }
}
