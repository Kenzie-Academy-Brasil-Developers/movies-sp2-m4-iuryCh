import { Client } from 'pg';
import 'dotenv/config';

const client: Client = new Client({
  user: process.env.user,
  host: process.env.host,
  port: +process.env.port!,
  password: process.env.password,
  database: process.env.database,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log('Database was connected');
};

export { startDatabase, client };
