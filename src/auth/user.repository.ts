import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/create-user.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.create({ username, password });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}