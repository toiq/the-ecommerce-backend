import { HttpException } from "./root.js";

export class InternalException extends HttpException {
  constructor(message: string, errorCode: number, errors: any) {
    super(message, errorCode, 500, errors);
  }
}
