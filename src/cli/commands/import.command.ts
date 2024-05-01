import { TSVFileReader } from '../../shared/libs/file-reader/index.js';

import type { ICommand } from './command.interface.js';

export class ImportCommand implements ICommand {
  getName(): string {
    return '--import';
  }

  execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
