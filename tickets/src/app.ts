import express from 'express';
import 'express-async-errors';
import {createTicketRouter} from "./routes/new";
import { displayTicketRouter } from './routes/show';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {NotFoundError, errorHandler, currentUser} from "@azulul_mobius/common"
import { displayAllTicketRouter } from './routes/showall';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(displayTicketRouter);
app.use(displayAllTicketRouter);
app.use(updateTicketRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
