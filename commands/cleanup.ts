import { subDays } from 'date-fns';

import { db } from '../src/db';

async function main() {
  const sixtyDaysAgo = subDays(new Date(), 32);
  const newest = await db('scrobble')
    .select()
    .where('scrobble.startTime', '<', sixtyDaysAgo)
    .first();
  console.log(newest);
}

main()
  .then(() => process.exit())
  .catch(e => console.error(e));
