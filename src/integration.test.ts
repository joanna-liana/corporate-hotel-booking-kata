import * as dotenv from 'dotenv';
import { Pool } from 'pg';


dotenv.config({
  path: '.env',
});

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5433/corporate_hotel_test';

describe('Integration scenarios', () => {
  // let hotelService: HotelService;
  // let bookingService: BookingService;
  let testPool: Pool;
  // let testDb: Database;

  // const hotelId = '1';

  beforeEach(() => {
    testPool = new Pool({
      connectionString: testDatabaseUrl,
      max: 1,
    });
    // testDb = drizzle(testPool);

    // hotelService = new HotelService(testDb);
  });

  afterEach(async () => {
    await testPool.end();
  });



  //  A change in quantity of rooms should not not affect existing bookings.
  // They will only affect new bookings, made after the change.
  it.todo('does not affect existing bookings');

  // create hotel
  // make a booking for 2 rooms
  // change hotel rooms to 1
  // ensure the booking did not change

});
