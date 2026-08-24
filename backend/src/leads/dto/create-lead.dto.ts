import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsIn(['call', 'whatsapp'], { message: 'Contact type must be call or whatsapp' })
  contactType: 'call' | 'whatsapp';
}
