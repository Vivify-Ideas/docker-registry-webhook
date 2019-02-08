import { check } from 'express-validator/check';
import { makeValidator } from './../../../shared/validator';

export const createUserValidator = makeValidator([
  check('email').isEmail(),
  check('password').exists().isLength({ min: 4 }),
  check('projects').exists().isArray().isLength({ min: 1 }),
])