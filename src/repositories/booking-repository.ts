
import { prisma } from '@/config';
import { count } from 'console';

export async function bookingByid(userId: number) {
    return prisma.booking.findUnique({
        where: {
            userId
        }
    })
}


export async function disponibilityByRoomId(roomId: number) {
    return await prisma.room.findUnique({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    })
}

export async function createBooking(roomId: number, userId: number) {
    return await prisma.booking.create({
        data: {
            roomId,
            userId
        }
    })

}

export async function findRoom(roomId: number) {
    return await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })
}

export async function deleteBooking(userId: number) {
    return await prisma.booking.delete({
        where: {
            userId
        }
    })
}
