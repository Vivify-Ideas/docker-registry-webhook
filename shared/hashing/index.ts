import bcrypt from 'bcrypt';

class WrongPassword extends Error {
  constructor() {
    super('Password is wrong')
    this.name = 'WrongPassword';
  }
}

export async function isSameHash(plain: string, hashed: string): Promise<void> {
  const isSame = await bcrypt.compare(plain, hashed);
  if (isSame) {
    return Promise.resolve();
  }

  throw new WrongPassword;
}