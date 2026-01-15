import { TokenPayloadDto } from '@/auth/dto';

declare module 'express' {
  interface Request {
    user?: TokenPayloadDto;
  }
}
