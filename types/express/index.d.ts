export {};

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      fileUrl?: string;
      fileUrls?: { [key: string]: string };
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    files?: { [key: string]: Express.Multer.File[] };
  }
}
