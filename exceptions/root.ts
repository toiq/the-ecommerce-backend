// message, statusCode, errorCodes, error
export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  // User-related errors
  USER_NOT_FOUND = 1000,
  USER_ALREADY_EXISTS = 1001,
  INCORRECT_CREDENTIALS = 1002,
  USER_UNAUTHORIZED = 1003,
  USER_ACCOUNT_LOCKED = 1004,
  INVALID_TOKEN = 1005,
  EMAIL_NOT_FOUND = 1006,
  BAD_FILE_FORMAT = 1007,
  FILE_TOO_LARGE = 1008,
  FAILED_TO_UPLOAD = 1009,
  WISHLIST_NOT_FOUND = 1010,
  CART_NOT_FOUND = 1011,

  // Address-related errors
  ADDRESS_NOT_FOUND = 1100,
  INVALID_ADDRESS_ID = 1101,
  ADDRESS_DOES_NOT_BELONG = 1102,

  // Product-related errors
  PRODUCT_NOT_FOUND = 2000,
  PRODUCT_OUT_OF_STOCK = 2001,
  PRODUCT_PRICE_MISMATCH = 2002,
  INVALID_PRODUCT_ID = 2003,

  // Category-related errors
  CATEGORY_NOT_FOUND = 2004,
  CATEGORY_ALREADY_EXISTS = 2005,

  // Brand-related errors
  BRAND_NOT_FOUND = 2006,
  BRAND_ALREADY_EXISTS = 2007,

  // Review-related errors
  REVIEW_ALREADY_EXISTS = 2008,
  REVIEW_NOT_FOUND = 2009,

  // Payment-related errors
  PAYMENT_FAILED = 3000,
  PAYMENT_METHOD_NOT_SUPPORTED = 3001,
  INSUFFICIENT_FUNDS = 3002,
  INVALID_COUPON_CODE = 3003,

  // Order-related errors
  ORDER_NOT_FOUND = 4000,
  ORDER_CANCELLATION_FAILED = 4001,
  ORDER_ALREADY_SHIPPED = 4002,
  ORDER_INVALID_STATUS = 4003,

  // Cart-related errors
  CART_EMPTY = 5000,
  CART_ITEM_NOT_FOUND = 5001,
  CART_ITEM_QUANTITY_EXCEEDS_STOCK = 5002,

  // General errors
  INTERNAL_SERVER_ERROR = 9000,
  BAD_REQUEST = 9001,
  UNAUTHORIZED_ACCESS = 9002,
  RESOURCE_NOT_FOUND = 9003,
  UNPROCESSABLE_ENTITY = 9004,
}
