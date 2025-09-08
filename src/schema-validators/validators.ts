import FastValidator from 'fastest-validator';
import { serverSettingsSchema } from './schemas/serverSettingsSchema';

const validator = new FastValidator();

export const serverSettingsValidator = validator.compile(serverSettingsSchema);
