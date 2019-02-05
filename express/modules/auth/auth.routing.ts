import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from './auth.controller';
import { UserRepository } from './../user';
import { authenticated } from './middleware';
import { loginValidator } from './validators';

const router = Router();
const controller = new AuthController(new UserRepository());


router.post('/login', ...loginValidator, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await controller.login(
      req.body.email,
      req.body.password
    );
    res.json(user);
  } catch(err) {
    next(err);
  }
});

router.get('/me',
  authenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await controller.getUser(
        req.body.email
      );
      res.json(user);
    } catch(err) {
      next(err);
    }
  }
)

export const authRouter = router;