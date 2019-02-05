import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import configuration from './../../../configuration';

class UnauthorizedError extends Error {
  constructor() {
    super("This Action is unauthorized");
    this.name = "UnauthorizedError";
  }
}

function unauthorized(res: Response, next: NextFunction) {
  res.status(403);
  next(new UnauthorizedError())
}

export async function authenticated(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  
  if (!header) {
    unauthorized(res, next);
    return;
  }
  
  try {
    let token = header.split(' ');
    const { email } = jwt.verify(token[1], configuration.JWT_SECRET_KEY) as any;
    req.user = { email };
    next();
  } catch(err) {
    unauthorized(res, next)
  }
}