import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDTO } from './dtos/contacts.dto';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiTags,
  ApiPropertyOptional,
} from '@nestjs/swagger';

class ContactGetAllParams {
  @ApiPropertyOptional()
  search: string;
  @ApiPropertyOptional()
  page: number;
  @ApiPropertyOptional()
  dateStart: string;
  @ApiPropertyOptional()
  dateEnd: string;
}

interface getOptions {
  [key: string]: any;
}

@ApiTags('Contacts')
@Controller('/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Contact Creat' })
  @ApiConflictResponse({ description: 'Contact Already exists' })
  @ApiNotAcceptableResponse({ description: 'Invalid Contact Details' })
  addContact(@Body() contact: ContactDTO): any {
    return this.contactsService.addContact(contact);
  }

  @Delete(':_id')
  @ApiOkResponse({ description: 'Contacts Deleted' })
  deleteOneContact(@Param('_id') _id: string) {
    return this.contactsService.deleteContact(_id);
  }

  @Get()
  @ApiOkResponse({ description: 'Contacts returned' })
  async getAllContacts(@Query() reqQuery: ContactGetAllParams) {
    let options: getOptions = {};

    if (reqQuery.search) {
      options = {
        $or: [
          { name: new RegExp(reqQuery.search.toString(), 'i') },
          { email: new RegExp(reqQuery.search.toString(), 'i') },
          { phone: new RegExp(reqQuery.search.toString(), 'i') },
          { date: new RegExp(reqQuery.search.toString(), 'i') },
        ],
      };
    }

    if (reqQuery.dateStart || reqQuery.dateEnd) {
      options.$match = {
        date: {
          $gt: reqQuery.dateStart
            ? new Date(reqQuery.dateStart)
            : new Date('1999-01-12T00:00:00.045Z'),
          $lt: reqQuery.dateEnd ? new Date(reqQuery.dateEnd) : new Date(),
        },
      };
    }

    let query = this.contactsService.getAllContacts(options);

    const page: number = parseInt(reqQuery.page as any) || 1;
    const limit = 9;
    const total = await this.contactsService.count(options);

    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, last_page: Math.ceil(total / limit) };
  }

  @Get(':name')
  @ApiOkResponse({ description: 'Contacts returned' })
  getContactByName(@Param('name') name: string) {
    return this.contactsService.getContactByName(name);
  }
}
