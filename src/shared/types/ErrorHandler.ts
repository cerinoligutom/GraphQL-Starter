import { BaseError } from '@/errors/base.error';

export type ErrorHandler = (err: Error) => BaseError | null;
