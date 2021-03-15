import { ensureFileSync } from 'https://deno.land/std@0.90.0/fs/mod.ts';
import { Contact } from '../interfaces/Contact.ts';

export class Manager {
  private data: Contact[] = [];

  constructor(public filename: string) {
    this.start();
  }

  /**
   * Start the manager by finding/creating a json file
   */
  start(): void {
    const path = './directory.json';

    // Find/create a json file to store our contacts
    ensureFileSync(path);
    this.read(path);
  }

  /**
   * Read the data of the json file
   */
  async read(path: string): Promise<void> {
    const fileContent = await Deno.readTextFile(path);

    if (fileContent === '') {
      this.data = [];
    } else {
      this.data = await JSON.parse(fileContent);
    }
  }
}
