import DatabaseService from "./database.service";

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return await DatabaseService.getInstance().collections.users?.findOne({
    email,
    password,
  });
};
