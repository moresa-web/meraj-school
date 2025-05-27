export interface TokenPayload {
    _id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

// اضافه کردن interface برای Request
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
} 