import { inject, injectable } from 'inversify';
import { Component } from '../../enums/index.js';
import { DEFAULT_COMMENTS_COUNT } from './comment.constants.js';
import { SortType } from '../../enums/index.js';

import type { types } from '@typegoose/typegoose';
import type { Logger } from '../../libs/logger/index.js';
import type {
  ICommentService,
  TDocCommentEntity,
  TGetListFilter,
} from './comment-service.interface.js';
import type { CommentEntity } from './comment.entity.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  async create(dto: CreateCommentDto): Promise<TDocCommentEntity> {
    const result = await this.commentModel.create(dto);

    this.logger.info(`New comment with rating ${dto.rating} created`);

    return result;
  }

  async getList(filter: TGetListFilter): Promise<TDocCommentEntity[]> {
    return this.commentModel
      .find({ offerId: filter?.offerId })
      .limit(filter?.limit || DEFAULT_COMMENTS_COUNT)
      .sort({ postDate: SortType.Down })
      .exec();
  }

  async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}