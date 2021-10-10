import { Document } from 'mongoose';

export interface myContact extends Document {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}
