import { Request, Response, NextFunction } from 'express';
import { UserRepository } from './../../modules/user';

const userRepository = new UserRepository();

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = await userRepository.findOne({
    email: req.user.email
  });

  if (!user.is_admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  return next();
}