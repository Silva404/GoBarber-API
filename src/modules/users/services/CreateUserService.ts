import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExist = await usersRepository.findOne({ where: { email } });

    const hashedPassword = await hash(password, 8);

    if (checkUserExist) {
      throw new Error('Email address already used.');
    }

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}
