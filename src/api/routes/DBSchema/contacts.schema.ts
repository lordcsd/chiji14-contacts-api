import * as mongoose from 'mongoose';

export const ContactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  date: { type: String, default: new Date().toISOString() },
});
