import { Nothing } from '../../../Domain-Driven-Design-Types/Generics';

export interface KeyValue {
  key: string;
  value: string;
}

export interface ICacheManager {
  set(key: string, value: string, duration?: number): Promise<void>;

  get(key: string): Promise<KeyValue | Nothing>;

  contain(key: string): Promise<boolean>;
}
