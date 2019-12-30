import redis from 'redis';

export const client = redis.createClient();

export async function getCache(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}
