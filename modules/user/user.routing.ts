
import { Router, NextFunction } from 'express';
import { Response, Request } from 'express';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { createUserValidator } from './validators';
import { isAdmin } from './../../shared/middlewares';
import { authenticated } from './../../modules/auth/middleware';

const router = Router();
const controller = new UserController(new UserRepository());

router.post('/',
  ...createUserValidator,
  authenticated,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await controller.store({
      email: req.body.email,
      password: req.body.password,
      projects: req.body.projects,
      is_admin: false
    });
    res.json(user);
  } catch(err) {
    next(err);
  }
});

export const userRouter = router;