import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import { getDatabaseUrl } from './config';
import * as schema from './schema';

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
export { schema };
