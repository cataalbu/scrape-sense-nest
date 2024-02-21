import * as bcrypt from 'bcrypt';

const SALT = 10;

export function hashPassword(plainPassword: string) {
  return bcrypt.hashSync(plainPassword, SALT);
}

export function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
