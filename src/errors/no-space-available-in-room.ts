import { ApplicationError } from '@/protocols';

export function NoSpaceOnRoom(): ApplicationError {
  return {
    name: 'NoSpaceOnRoom',
    message: 'No bookings available on given room',
  };
}
