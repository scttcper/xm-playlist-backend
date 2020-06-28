import { admin } from '../src/firebaseAdmin';
import { db } from '../src/db';

let missing = 0;

async function listAllUsers(nextPageToken?: any) {
  // List batch of users, 1000 at a time.
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

  for (const userRecord of listUsersResult.users) {
    const user = userRecord.toJSON() as any;
    console.log('user', user);
    const existing = await db('user')
      .select<{ id: string; }>(['user.id as id'])
      .where('user.id', '=', user.uid)
      .limit(1)
      .first();

    if (!existing) {
      await db('user').insert({
        id: user.uid,
        email: user.email,
      });
      missing += 1;
    }
  }
  if (listUsersResult.pageToken) {
    // List next batch of users.
    return listAllUsers(listUsersResult.pageToken);
  }
}

listAllUsers()
  .then(() => {
    console.log({ missing });
    process.exit();
  })
  .catch(e => console.error(e));
