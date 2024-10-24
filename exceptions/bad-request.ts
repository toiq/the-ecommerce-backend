import { ErrorCode, HttpException } from "./root.js";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
