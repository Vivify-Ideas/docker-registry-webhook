import { check } from 'express-validator/check';
import { makeValidator } from './../../../shared/validator';

export const loginValidator = makeValidator([
  check('email').isEmail(),
  check('password').exists()
])