import DatabaseService from "./database.service";
import bcrypt from "bcryptjs";

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await getUserByEmail(email);
  if (user) {
    const doMatch = await bcrypt.compare(user.password, password);
    if (doMatch) {
      return user;
    }
  }

  return null;
};

export const getUserByEmail = async (email: string) => {
  return await DatabaseService.getInstance().collections.users?.findOne({
    email,
  });
};
