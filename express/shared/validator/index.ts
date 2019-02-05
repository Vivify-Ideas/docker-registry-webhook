import { ValidationChain, validationResult } from "express-validator/check";
import { NextFunction, Request, Response } from "express";

export function makeValidator(validator: ValidationChain[]) {
  return [
      validator,
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
  ]
}