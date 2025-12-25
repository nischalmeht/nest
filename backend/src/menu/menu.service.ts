import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { MenuCategory, MenuCategoryDocument } from './schema/menu-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMenuItemDto } from './dto/CreateMenuItem.dto';
import { MenuItem, MenuItemDocument } from './schema/menu-item.schema';
import { CreateMenuCategoryDto } from './dto/CreateMenuCategory.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
@Injectable()
export class MenuService {
  constructor(@InjectModel(MenuCategory.name)
  private menuCategoryModel: Model<MenuCategoryDocument>,
 @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
      private readonly cloudinaryService: CloudinaryService,
) { }
  async create(createMenuDto:CreateMenuCategoryDto,) {
     const cloudinaryResponse = await this.cloudinaryService.uploadFile(createMenuDto?.imageUrl);

    const exists = await this.menuCategoryModel.findOne({
      name: createMenuDto.name,
      hotelId: createMenuDto.hotelId,
       imageUrl: cloudinaryResponse?.secure_url,
      isActive: true,
    });

    if (exists) {
      throw new ConflictException('Menu category already exists');
    }

    const category = new this.menuCategoryModel({
      name: createMenuDto.name,
      description: createMenuDto.description,
      hotelId: new Types.ObjectId(createMenuDto.hotelId),
      isActive: createMenuDto.isActive ?? true,
    });
    return category.save()
  }

  async findAll(hotelId?: string) {
    const filter: any = { isActive: true };

    if (hotelId) {
      filter.hotelId = new Types.ObjectId(hotelId);
    }

    return this.menuCategoryModel
      .find(filter)
      .sort({ createdAt: 1 });
  }

  async findOne(id: string) {
    const category = await this.menuCategoryModel.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      throw new NotFoundException('Menu category not found');
    }

    return category;
  }
   async createMenu(dto: CreateMenuItemDto) {
    const item = new this.menuItemModel({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
    });

    return item.save();
  }



}
