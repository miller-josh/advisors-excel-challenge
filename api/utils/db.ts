import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

export default db;
