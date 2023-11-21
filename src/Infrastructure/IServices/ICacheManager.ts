export interface KeyValue {
  key: string;
  value: string;
}

export interface ICacheManager {
  set(key: string, value: string, duration?: number): Promise<void>;

  get(key: string): Promise<KeyValue | null>;

  contain(key: string): Promise<boolean>;

  remove(key: string): Promise<void>;
}
