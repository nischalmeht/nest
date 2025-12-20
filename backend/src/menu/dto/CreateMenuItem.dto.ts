export class CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  imageUrl?: string;
  categoryId: string;
}
