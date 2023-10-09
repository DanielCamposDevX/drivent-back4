import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { getBookingbyuserId, postBookingWithRoomId, putBookingbyId } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const book = await getBookingbyuserId(userId);
  return res.status(200).send(book);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) {
    return res.sendStatus(404);
  }
  const booking = await postBookingWithRoomId(roomId, userId);
  res.status(200).send({ bookingId: booking.id });
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;
  const book = await putBookingbyId(roomId, Number(bookingId), userId);
  return res.status(200).send({ bookingId: book.id });
}
