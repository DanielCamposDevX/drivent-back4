import Joi from 'joi';

export const bookingSchema = Joi.object({
  roomId: Number,
});
