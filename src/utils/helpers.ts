import bcrypt from "bcrypt";


// Method to compare passwords
export const verifyPassword = async  (plainTextPassword: string,
  hashPassword: string
): Promise<boolean> =>{
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

