import { prisma } from '@/config';

export async function bookingByid(userId: number) {
    return prisma.booking.findUnique({
        where: {
            userId,
        },
        include:{
            Room: true
        }
    });
}

export async function disponibilityByRoomId(roomId: number) {
    return await prisma.room.findUnique({
        where: {
            id: roomId,
        },
        include: {
            Booking: true,
        },
    });
}

export async function createBooking(roomId: number, userId: number) {
    return await prisma.booking.create({
        data: {
            roomId,
            userId,
        },
    });
}



export async function deleteBooking(bookingId: number) {
    return await prisma.booking.delete({
        where: {
            id: bookingId,
        },
    });
}
