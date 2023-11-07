import { Schema, model } from 'mongoose';

export interface IUserModel {
  _id: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUserModel>({
  _id: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model<IUserModel>('User', userSchema);
