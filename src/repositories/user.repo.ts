import db from "models";
import { IUser } from "models/user.model";
import Joi from "joi";

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const user = await db.User.findOne({ email }).exec();
    return user
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = await db.User.create(userData);
  return user; 
};

export const findByIdentifier = async (identifier: string): Promise<IUser | null> =>  {
    // Use Joi to detect if identifier is a valid email
    const isEmail = Joi.string().email({ tlds: { allow: false } }).validate(identifier).error === undefined;

    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { username: identifier.toLowerCase() };

    return await db.User.findOne(query).select('+password').lean();
  }