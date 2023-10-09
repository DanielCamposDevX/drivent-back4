import { ApplicationError } from '@/protocols';

export function NoBookingsForUser(): ApplicationError {
  return {
    name: 'NoBookingsForUser',
    message: 'No bookings made by you',
  };
}
