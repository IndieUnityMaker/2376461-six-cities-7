import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { SortOrder } from 'mongoose';

export type TGetListFilter = {
  limit: number;
};
export type TOfferEntityDocument = DocumentType<OfferEntity>;

export type TInnerGetListFilter = {
  filter?: Partial<{
    cityId: string;
    isPremium: boolean;
  }>;
  limit?: number;
  sorting?: { [key: string]: SortOrder };
};

export interface OfferService {
  create(dto: CreateOfferDto): Promise<TOfferEntityDocument>;
  findById(offerId: string): Promise<TOfferEntityDocument | null>;
  getList(filter?: Partial<TGetListFilter>): Promise<TOfferEntityDocument[]>;
  deleteById(offerId: string): Promise<TOfferEntityDocument>;
  updateById(
    offerId: string,
    dto: CreateOfferDto
  ): Promise<TOfferEntityDocument>;
  updateOfferStatistics(
    offerId: string,
    rating: number
  ): Promise<TOfferEntityDocument>;
  exists(offerId: string): Promise<boolean>;
  findPremiumsByCityId(cityId: string): Promise<TOfferEntityDocument[]>;
  getByOfferIds(offerIds: string[]): Promise<TOfferEntityDocument[] | false>;
}
