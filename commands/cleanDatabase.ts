import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import { Play } from '../models';

async function loop() {
  const old = subDays(new Date(), 120);
  const query1 = {
    where: {
      startTime: { [Op.lte]: old },
    },
  };
  const playDeleted = await Play.count(query1);
  console.log('playDeleted', playDeleted);
  if (playDeleted > 0) {
    await Play.destroy(query1);
  }
}

loop()
  .then(() => process.exit())
  .catch(e => console.error(e));
