import { ValidationError } from 'fastest-validator';

export type ValidatorResponse = true | ValidationError[] | Promise<true | ValidationError[]>;
