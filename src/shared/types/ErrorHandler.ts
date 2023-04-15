import { BaseError } from '@/errors/base.error.js';

export type ErrorHandler = (err: Error) => BaseError | null;
