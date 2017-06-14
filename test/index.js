const mongo = require('../src/mongo');

after(async function flush() {
  const db = await mongo;
  db.dropDatabase();
});
