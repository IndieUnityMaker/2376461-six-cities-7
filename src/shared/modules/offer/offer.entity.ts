import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { UserEntity } from '../user/user.entity.js';
import { TCoords, TUser } from '../../types/index.js';
import { Comfort } from '../../enums/comfort.enum.js';
import { Housing } from '../../enums/housing.enum.js';
import { City } from '../../enums/city.enum.js';
import { CityEntity } from '../city/city.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    maxlength: 100,
    minlength: 10,
    type: String
  })
  public title!: string;

  @prop({
    trim: true,
    required: true,
    maxlength: 1024,
    minlength: 20,
    type: String
  })
  public description!: string;

  @prop({ required: true, type: Date })
  public postDate!: Date;

  @prop({
    ref: CityEntity,
    required: true,
    type: String
  })
  public cityId!: Ref<City>;

  @prop({ required: true, type: String })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String]
  })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({
    required: true,
    min: 1,
    max: 5,
    type: Number
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public type!: Housing;

  @prop({
    required: true,
    min: 1,
    max: 8,
    type: Number
  })
  public bedrooms!: number;

  @prop({
    required: true,
    min: 1,
    max: 10,
    type: Number
  })
  public maxAdults!: number;

  @prop({
    required: true,
    min: 100,
    max: 100000,
    type: Number
  })
  public price!: number;

  @prop({
    required: true,
    type: String,
    default: [],
    enum: Comfort
  })
  public comfort!: Comfort[];

  @prop({ required: true })
  public location!: TCoords;

  @prop({
    ref: UserEntity,
    required: true,
    type: () => String
  })
  public userId!: Ref<TUser>;
}

export const OfferModel = getModelForClass(OfferEntity);
