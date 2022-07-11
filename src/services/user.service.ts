import DatabaseService from "./database.service";
import { match } from "./encrypt.service";

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await getUserByEmail(email);
  if (user) {
    const doMatch = await match(password, user.password);
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
