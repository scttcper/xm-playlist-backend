import { subDays } from 'date-fns';

import { db } from '../src/db';

async function main() {
  const sixtyDaysAgo = subDays(new Date(), 90);
  const total = await db('scrobble')
    .select()
    .where('scrobble.startTime', '<', sixtyDaysAgo)
    .count();
  console.log('Scrobbles removed', total[0].count);

  await db('scrobble')
    .delete()
    .where('scrobble.startTime', '<', sixtyDaysAgo);
}

main()
  .then(() => process.exit())
  .catch(e => console.error(e));
