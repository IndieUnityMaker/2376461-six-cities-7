import { DotenvParseOutput, config } from 'dotenv';
import { Config } from './config.interface.js';

import { Logger } from '../logger/index.js';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(private readonly logger: Logger){
    const parsedOutput = config();

    if(parsedOutput.error){
      throw new Error('Cant read .env file. File not exists');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env parsed');
  }

  get(key: string): string | undefined {
    return this.config[key];
  }
}