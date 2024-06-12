import { TCoords } from '../../../types/index.js';
import { Comfort } from '../../../enums/comfort.enum.js';
import { Housing } from '../../../enums/housing.enum.js';
import { TOffer } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public cityId: string;
  public previewImage: string;
  public photos: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: Housing;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public comfort: Comfort[];
  public location: TCoords;
  public userId: string;
}

export class UpdateOfferDto {
  title?: TOffer['title'];
  description?: TOffer['description'];
  cityId?: string;
  preview?: TOffer['preview'];
  photos?: TOffer['photos'];
  isPremium?: TOffer['isPremium'];
  housing?: TOffer['housing'];
  roomQuantity?: TOffer['roomQuantity'];
  guestQuantity?: TOffer['guestQuantity'];
  rentCost?: TOffer['rentCost'];
  comfort?: TOffer['comfort'];
}
