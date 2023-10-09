import { ApplicationError } from '@/protocols';

export function NoBookingsForUser(): ApplicationError {
  return {
    name: 'NoBookingsForUser',
    message: 'No bookings made by you',
  };
}

export function NoBookingsForUsertoChange(): ApplicationError {
  return {
    name: 'NoBookingsForUsertoChange',
    message: 'No bookings made by you',
  };
}
