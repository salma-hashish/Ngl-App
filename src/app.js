import express from 'express';
import connectDB from "./lib/db/mongoose.js";
import cors from "cors";
import { globalErrorHandler, invalidRoute } from "./pkg/error/error.handler.js";
import { router } from "./route.js";
import { correlationId } from "./lib/correlation/correlationid.js";
import cookieParser from "cookie-parser";
import { rateLimit } from 'express-rate-limit';
import { toMs } from './pkg/utils/time/time.js';
import { AppError } from './pkg/error/error.js';

const limiter = rateLimit({
  windowMs: toMs(3, 'minutes'),
  limit: 3,
  handler: function (req, res, next) {
    next(new AppError('Too many requests, please try again later.', 429));
  },
  legacyHeaders: false,
  standardHeaders: 'draft-8',
  identifier: function (req) {
    return `${req.ip}:${req.url}`;
  },
});

export function createApp() {
  const app = express();
  app.use(cors({ origin: "*", credentials: true }));
  // connect to DB
  connectDB();
  // parse req body buffer -> object
  // app.use(limiter);
  app.use(express.json()); // {}
  app.use(cookieParser());
  app.use(correlationId);
  app.use('/src', express.static('src'));
  // routes - map features

  app.get('/health', (req, res, next) => {
    console.log('server 2 Hit');

    res.json('OK');
  });
  app.use('/api', router);
  app.use(invalidRoute);
  // global error handler

  app.use(globalErrorHandler);

  return app;
}

export default createApp;
