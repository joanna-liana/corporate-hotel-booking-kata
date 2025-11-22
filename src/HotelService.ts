import { eq } from 'drizzle-orm';

import { hotels } from './db/schema';
import { Database } from './db/types';

type SetRoomParams = {
  hotelId: string;
  rooms: {
    type: string;
    quantity: number;
  };
};

type HotelReadModel = {
  hotelId: string;
  rooms: {
    type: string;
    quantity: number;
  };
};

export class HotelService {
  constructor(private readonly database: Database) {}

  async setRoomType({ hotelId, rooms }: SetRoomParams): Promise<void> {
    await this.database
      .insert(hotels)
      .values({
        id: hotelId,
        rooms,
      })
      .onConflictDoUpdate({
        target: hotels.id,
        set: {
          rooms,
        },
      });
  }

  async findHotelBy(hotelId: string): Promise<HotelReadModel | undefined> {
    const result = await this.database
      .select()
      .from(hotels)
      .where(eq(hotels.id, hotelId))
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const hotel = result[0];

    return {
      hotelId: hotel.id,
      rooms: hotel.rooms,
    };
  }
}
