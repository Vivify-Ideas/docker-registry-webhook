import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { projectBuilderRouter } from './modules/project-builder/project-builder.routing';
import { userRouter } from './modules/user/user.routing';
import { authRouter } from './modules/auth/auth.routing';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', projectBuilderRouter);
app.use('/user', userRouter)
app.use('/auth', authRouter)

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    return next();
  }

  res.json(error);
});

export default app;
