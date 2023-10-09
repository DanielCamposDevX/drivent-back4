import { getBooking, postBooking, putBooking } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';
import { Router } from 'express';


const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
    .get('/booking', getBooking)
    .post('/booking', validateBody(bookingSchema), postBooking)
    .put('/booking/:bookingId', putBooking)

export { bookingRouter };