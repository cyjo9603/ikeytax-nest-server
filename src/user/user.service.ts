import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument, UserType } from '@models/user.model';
import { PaymentInfo } from '@/graphql';
import { encryptPassword } from '@utils/bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    phone: string,
    payment: PaymentInfo,
  ): Promise<User> {
    const createdUser = new this.userModel({
      name,
      email,
      password: encryptPassword(password),
      phone,
      payment,
      type: UserType.user,
    });

    return createdUser.save();
  }
}
