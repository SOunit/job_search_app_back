import bcrypt from "bcryptjs";

export const hash = async (password: string) => await bcrypt.hash(password, 12);

export const match = async (password: string, hashedPassword: string) =>
  await bcrypt.compare(password, hashedPassword);
