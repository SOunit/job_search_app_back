import bcrypt from "bcryptjs";

export const hash = async (password: string) => await bcrypt.hash(password, 12);
