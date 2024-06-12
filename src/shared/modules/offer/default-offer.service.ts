import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService, TInnerGetListFilter } from './offer-service.interface.js';
import { Component } from '../../enums/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/create-offer.dto.js';
import { SortType } from '../../enums/sort-type.enum.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constants.js';
import { TGetListFilter } from '../comment/comment-service.interface.js';
import { TOfferEntityDocument } from './offer-service.interface.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  private async _getList({
    filter = {},
    limit = DEFAULT_OFFER_COUNT,
    sorting = { createdAt: SortType.Down }
  }: Partial<TInnerGetListFilter>): Promise<TOfferEntityDocument[]> {
    return this.offerModel
      .find(filter)
      .populate('cityId')
      .limit(limit)
      .sort(sorting)
      .exec();
  }

  async getList({
    limit = DEFAULT_OFFER_COUNT
  }: Partial<TGetListFilter> = {}): Promise<TOfferEntityDocument[]> {
    return this._getList({ limit });
  }

  async findPremiumsByCityId(cityId: string): Promise<TOfferEntityDocument[]> {
    return this._getList({
      limit: DEFAULT_PREMIUM_OFFER_COUNT,
      filter: { cityId, isPremium: true }
    });
  }

  async getByOfferIds(offerIds: string[]): Promise<TOfferEntityDocument[] | false> {
    const offers = await this.offerModel
      .find({
        _id: {
          $in: offerIds.map((offerId) => new Types.ObjectId(offerId))
        }
      })
      .populate('cityId');

    return offers?.length ? offers : false;
  }

  async deleteById(offerId: string): Promise<TOfferEntityDocument> {
    const result = await this.offerModel.findByIdAndDelete(offerId).exec();

    if (result) {
      this.logger.info(`Offer deleted. Id: ${offerId}`);
    }
    return result as TOfferEntityDocument;

  }

  async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<TOfferEntityDocument> {
    const updatedDocument = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .exec();

    if (!updatedDocument) {
      this.logger.error('Document not updated',new Error('updateById'));
    }

    return updatedDocument as TOfferEntityDocument;
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  async updateOfferStatistics(
    offerId: string,
    rating: number
  ): Promise<TOfferEntityDocument> {
    const updatedDocument = await this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
          sumRating: rating
        }
      })
      .exec();

    if (!updatedDocument) {
      this.logger.error('Statistics of document not updated',new Error('updateOfferStatistics'));
    }

    return updatedDocument as TOfferEntityDocument;

  }

}
