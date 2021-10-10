import { ApiProperty } from '@nestjs/swagger';

export class ContactDTO {
  @ApiProperty({
    type: String,
    description: 'Contact name',
    default: '',
  })
  public name: string;

  @ApiProperty({
    type: String,
    description: 'Contact Email',
    default: '',
  })
  public email: string;

  @ApiProperty({
    type: String,
    description: 'Contact Phone',
    default: '',
  })
  public phone: string;
}
