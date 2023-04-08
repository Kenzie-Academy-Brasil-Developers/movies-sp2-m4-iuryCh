import { Client } from 'pg';

const client: Client = new Client({
  user: 'iuryv',
  host: 'localhost',
  port: 5432,
  password: '3078',
  database: 'movies_database',
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log('Database was connected');
};

export { startDatabase, client };
