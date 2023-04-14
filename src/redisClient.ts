import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';

class RedisClientSingleton {
  private static instance: RedisClientSingleton;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient();
    this.client.on('error', (err: any)  => console.log('Redis Client Error', err));
  }

  public static getInstance(): RedisClientSingleton {
    if (!RedisClientSingleton.instance) {
      RedisClientSingleton.instance = new RedisClientSingleton();
    }
    return RedisClientSingleton.instance;
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  public async getListData(key: string): Promise<string[]> {
    return await this.client.LRANGE(key, 0, -1);
  }
}

export default RedisClientSingleton;