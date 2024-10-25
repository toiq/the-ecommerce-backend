export {};

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      fileUrl?: string;
      fileUrls?: any;
      files?: { [fieldname: string]: any };
    }
  }
}
