import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument, UserType } from '@models/user.model';
import { Driver } from '@models/driver.model';
import { Payment } from '@models/payment.model';
import { Location } from '@models/location.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    phone: string,
    payment: Payment,
  ): Promise<User> {
    const createdUser = new this.userModel({
      name,
      email,
      password,
      phone,
      payment,
      type: UserType.user,
    });

    return createdUser.save();
  }

  async createDriver(name: string, email: string, password: string, phone: string, driver: Driver) {
    const createDriver = new this.userModel({
      name,
      email,
      password,
      phone,
      driver,
      type: UserType.driver,
    });

    return createDriver.save();
  }

  async findOne(email: string, loginType: UserType): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ email, type: loginType });

    return user;
  }

  async findOneById(userId): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(userId);

    return user;
  }

  async getPayment(userId): Promise<Payment> {
    const user = await this.userModel.findById(userId, 'payment');
    return user.get('payment');
  }

  async getLocation(userId): Promise<number[]> {
    const user = await this.userModel.findById(userId, 'location');
    return user.get('location') || [0, 0];
  }

  async updateLocation(userId: string, location: Location): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { location });
  }
}
