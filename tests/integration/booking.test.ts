import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createFullRoomWithHotelId, createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import app, { init } from '@/app';
import { createBooking } from '@/repositories';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});
const server = supertest(app);

describe('Booking routes', () => {
  describe('get Booking', () => {
    it('should respond 404 when user dont have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const resp = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(resp.status).toBe(404);
    });

    it('should get user booking with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking(room.id, user.id);

      const resp = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(resp.status).toBe(200);
    });
  });

  describe('post booking', () => {
    it('Should respond with 404 when roomId is not provided', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`);
      expect(resp.status).toBe(404);
    });
    it('Should respond with 404 when room dont exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 2201012 });
      expect(resp.status).toBe(404);
    });

    it('Should respond with 403 when there is no space available on room', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createFullRoomWithHotelId(hotel.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 403 if user already has a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking(room.id, user.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 403 if user ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enroll = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      await createTicket(enroll.id, ticketType.id, 'PAID');
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 403 if user ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enroll = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      await createTicket(enroll.id, ticketType.id, 'PAID');
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 403 if user ticket is not paid!', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enroll = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enroll.id, ticketType.id, 'RESERVED');
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 200 when booking is created', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enroll = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enroll.id, ticketType.id, 'PAID');
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const resp = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(resp.status).toBe(200);
    });
  });

  describe('put /booking', () => {
    it('Should respond with 404 when there is no booking for user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const resp = await server.put('/booking/2').set('Authorization', `Bearer ${token}`).send({ roomId: 2201012 });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 404 when there is no room with that id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const Oldroom = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(Oldroom.id, user.id);
      const resp = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: 2201012 });
      expect(resp.status).toBe(404);
    });

    it('Should respond with 403 when there is no space available on room', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const Oldroom = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(Oldroom.id, user.id);
      const room = await createFullRoomWithHotelId(hotel.id);
      const resp = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 403 when booking id is not from user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const Oldroom = await createRoomWithHotelId(hotel.id);
      await createBooking(Oldroom.id, user.id);
      const room = await createFullRoomWithHotelId(hotel.id);
      const resp = await server
        .put(`/booking/210210210`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });
      expect(resp.status).toBe(403);
    });

    it('Should respond with 200 when booking is updated', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const Oldroom = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(Oldroom.id, user.id);
      const room = await createRoomWithHotelId(hotel.id);
      const resp = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });
      expect(resp.status).toBe(200);
    });
  });
});
