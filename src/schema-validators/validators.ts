import FastValidator from 'fastest-validator';
import serverSettingsSchema from './schemas/serverSettings';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const validator = new FastValidator();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
export const serverSettingsValidator = validator.compile(serverSettingsSchema);
