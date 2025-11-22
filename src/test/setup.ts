import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/corporate_hotel_test';

let testPool: Pool | null = null;
let testDb: ReturnType<typeof drizzle> | null = null;

beforeAll(async () => {
  testPool = new Pool({
    connectionString: testDatabaseUrl,
    max: 1,
  });

  testDb = drizzle(testPool);

  // Run migrations
  await migrate(testDb, { migrationsFolder: './drizzle' });
});

afterAll(async () => {
  if (testPool) {
    await testPool.end();
    testPool = null;
    testDb = null;
  }
});

// Clean up data between tests
beforeEach(async () => {
  if (testDb) {
    const { hotels } = await import('../db/schema');
    await testDb.delete(hotels);
  }
});
