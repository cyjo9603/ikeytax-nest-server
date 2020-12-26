import bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export const encryptPassword = (password: string): string => {
  const hashPassword = bcrypt.hashSync(password, SALT_ROUND);

  return hashPassword;
};

export const isComparedPassword = (password: string, hashPassword: string): boolean => {
  const isCompared = bcrypt.compareSync(password, hashPassword);

  return isCompared;
};
