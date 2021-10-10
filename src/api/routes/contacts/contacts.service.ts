import { HttpException, Injectable, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { myContact } from './interfaces/contact.interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('Contact') private readonly contactModel: Model<myContact>,
  ) {}

  async addContact(newContact: { name: string; email: string; phone: string }) {
    if (newContact.name && newContact.email && newContact.phone) {
      const initialStored = await this.contactModel.find(newContact);
      if (initialStored && initialStored[0]) {
        throw new HttpException('Contact Already exist', 409);
      } else {
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newContact.email)
        ) {
          const contact = new this.contactModel(newContact).save();
          return contact;
        } else {
          throw new HttpException('Invalid Input', 406);
        }
      }
    } else {
      throw new HttpException('InComplete Data', 406);
    }
  }

  getAllContacts(options: { name?: string; email?: string; phone?: string }) {
    let contact = this.contactModel.find(options).sort('-date');
    if (!contact) {
      throw new HttpException('No Contact Saved', 404);
    }
    return contact;
  }

  count(options) {
    return this.contactModel.count(options);
  }

  async getContactByName(name: string) {
    const contact = await this.contactModel.find({
      name: new RegExp(name, 'i'),
    });
    if (!contact) {
      throw new HttpException('Contact Not Found', 404);
    }
    return contact;
  }

  async deleteContact(_id: string) {
    const contact = await this.contactModel.deleteOne({ _id: _id });
    return contact;
  }
}
