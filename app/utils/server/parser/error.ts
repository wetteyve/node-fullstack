import { data } from 'react-router';

const DEFAULT_ERROR_MESSAGE = 'Bad Request';
const DEFAULT_ERROR_STATUS = 400;

export const createErrorResponse = (
  options: {
    message?: string;
    status?: number;
  } = {}
): Response => {
  const statusText = options?.message || DEFAULT_ERROR_MESSAGE;
  const status = options?.status || DEFAULT_ERROR_STATUS;
  return data(statusText, { status, statusText }) as unknown as Response;
};
