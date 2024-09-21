import FastValidator from 'fastest-validator';
import { serverSettingsSchema } from './schemas/serverSettings';

const validator = new FastValidator();

export const serverSettingsValidator = validator.compile(serverSettingsSchema);
