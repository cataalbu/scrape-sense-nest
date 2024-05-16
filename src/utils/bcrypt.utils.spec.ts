import { hashPassword, comparePasswords } from './bcrypt.utils';

describe('bcrypt utils', () => {
  describe('hashPassword', () => {
    it('should return a hashed password', () => {
      const plainPassword = 'password';
      const hashedPassword = hashPassword(plainPassword);
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', () => {
      const plainPassword = 'password';
      const hashedPassword = hashPassword(plainPassword);
      const result = comparePasswords(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', () => {
      const plainPassword = 'password';
      const hashedPassword = hashPassword(plainPassword);
      const result = comparePasswords('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });
  });
});
