import { NoBookingsForUser, NoSpaceOnRoom, notFoundError } from "@/errors";
import { bookingByid, createBooking, deleteBooking, disponibilityByRoomId, findRoom } from "@/repositories";


export async function getBookingbyuserId(userId: number) {
    const booking = await bookingByid(userId);
    if (!booking) { throw NoBookingsForUser() };
    return booking;
}

export async function postBookingWithRoomId(roomId: number, userId: number) {
    const room = await disponibilityByRoomId(roomId);
    if (room.Booking.length >= room.capacity) {
        throw NoSpaceOnRoom()
    }
    const booking = await createBooking(roomId, userId);
    return booking;
}


export async function putBookingbyId(roomId: number, bookingId: number, userId: number) {
    const booking = await bookingByid(userId);
    if (!booking) { throw NoBookingsForUser() };

    const room = await findRoom(roomId);
    if (!room) { throw notFoundError() };

    await deleteBooking(bookingId);

    const book = await postBookingWithRoomId(roomId, userId);
    return book;
}



