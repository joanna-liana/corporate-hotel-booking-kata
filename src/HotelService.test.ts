import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { Database } from './db/types';
import { HotelService } from './HotelService';

dotenv.config({
  path: '.env',
});

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5433/corporate_hotel_test';

describe('HotelService', () => {
  let service: HotelService;
  let testPool: Pool;
  let testDb: Database;

  const hotelId = '1';

  beforeEach(() => {
    testPool = new Pool({
      connectionString: testDatabaseUrl,
      max: 1,
    });
    testDb = drizzle(testPool);
    service = new HotelService(testDb);
  });

  afterEach(async () => {
    await testPool.end();
  });

  describe('setRoomType', () => {
    describe('when the hotel does not exist', () => {
      it('creates a hotel with the given room type and quantity', async () => {
        // when
        await service.setRoomType({
          hotelId,
          rooms: {
            type: 'standard',
            quantity: 10,
          },
        });


        // when
        const result = await service.findHotelBy(hotelId);

        // then
        expect(result).toEqual({
          hotelId,
          rooms: {
            type: 'standard',
            quantity: 10,
          },
        });
      });
    });

    describe('when the hotel exists', () => {
      it.each([
        ['quantity only', 'standard', 20],
        ['room type only', 'junior suite', 10],
        ['room type and quantity', 'junior suite', 20],
      ])(
        'updates the hotel room - %s',
        async (_description, roomType, quantity) => {
          // given
          await service.setRoomType({
            hotelId,
            rooms: {
              type: roomType,
              quantity: quantity,
            },
          });

          const controlEntityId = hotelId + 1;
          const controlEntity = {
            hotelId: controlEntityId,
            rooms: {
              type: roomType,
              quantity: quantity,
            },
          };

          await service.setRoomType(controlEntity);

          // when
          const result = await service.findHotelBy(hotelId);

          // then
          expect(result).toEqual({
            hotelId,
            rooms: {
              type: roomType,
              quantity: quantity,
            },
          });

          const controlEntityAfterChange = await service.findHotelBy(controlEntityId);

          expect(controlEntityAfterChange).toEqual(controlEntity);

        },
      );
    });
  });
});
