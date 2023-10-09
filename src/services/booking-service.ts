import {
  Forbidden,
  NoBookingsForUser,
  NoBookingsForUsertoChange,
  NoSpaceOnRoom,
  UseralreadyHasBooking,
  notFoundError,
} from '@/errors';
import {
  bookingByid,
  createBooking,
  deleteBooking,
  disponibilityByRoomId,
  findEnrollmentById,
  findTicketType,
} from '@/repositories';

export async function getBookingbyuserId(userId: number) {
  const booking = await bookingByid(userId);
  if (!booking) {
    throw NoBookingsForUser();
  }
  return booking;
}

export async function postBookingWithRoomId(roomId: number, userId: number) {
  const room = await disponibilityByRoomId(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw NoSpaceOnRoom();
  }
  const alreadyHasBooking = await bookingByid(userId);
  if (alreadyHasBooking) {
    throw UseralreadyHasBooking();
  }
  const enroll = await findEnrollmentById(userId);
  const ticket = await findTicketType(enroll.Ticket.id);
  if (ticket.TicketType.isRemote) {
    throw Forbidden('Your ticket is remote');
  }
  if (!ticket.TicketType.includesHotel) {
    throw Forbidden('Your ticket does not include hotel');
  }
  if (ticket.status !== 'PAID') {
    throw Forbidden('Your ticket has not been paid yet!');
  }

  const booking = await createBooking(roomId, userId);
  return booking;
}

export async function putBookingbyId(roomId: number, bookingId: number, userId: number) {
  const booking = await bookingByid(userId);

  if (!booking) {
    throw NoBookingsForUsertoChange();
  }

  if (bookingId !== booking.id) {
    throw NoSpaceOnRoom();
  }

  const room = await disponibilityByRoomId(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw NoSpaceOnRoom();
  }

  await deleteBooking(bookingId);

  const book = await createBooking(roomId, userId);
  return book;
}
