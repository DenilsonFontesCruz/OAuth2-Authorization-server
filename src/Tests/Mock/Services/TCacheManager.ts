import { Nothing } from '../../../../Domain-Driven-Design-Types/Generics';
import {
  ICacheManager,
  KeyValue,
} from '../../../Infrastructure/IServices/ICacheManager';
import { sleep } from '../tools/SleepFunction';

export class TCacheManager implements ICacheManager {
  private cache: KeyValue[];

  constructor(cache?: KeyValue[]) {
    if (cache == undefined) {
      this.cache = [];
    } else {
      this.cache = cache;
    }
  }

  async remove(key: string): Promise<void> {
    const index = this.cache.findIndex((item) => {
      return item.key === key;
    });

    this.cache.splice(index, 1);
  }

  async set(key: string, value: string, duration?: number): Promise<void> {
    this.cache.push({
      key,
      value,
    });
    if (duration) {
      await sleep(duration);

      const index = this.cache.findIndex((item) => {
        return item.key === key;
      });

      this.cache.splice(index, 1);
    }
  }
  async get(key: string): Promise<KeyValue | null> {
    const item = this.cache.find((item) => {
      return item.key === key;
    });

    if (!item) {
      return null;
    }

    return item;
  }
  async contain(key: string): Promise<boolean> {
    if (await this.get(key)) {
      return true;
    }

    return false;
  }
}
