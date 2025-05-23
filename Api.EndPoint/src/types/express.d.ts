import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface TokenPayload {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
} 