import { ensureFileSync } from 'https://deno.land/std@0.90.0/fs/mod.ts';
import { Contact } from '../interfaces/Contact.ts';

export class Manager {
  private data: Contact[] = [];
  private path: string = './directory.json';
  constructor() {
    this.start();
  }

  /**
   * Start the manager by finding/creating a json file
   */
  start(): void {
    // Find/create a json file to store our contacts
    ensureFileSync(this.path);
    this.read(this.path);
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

  async write(): Promise<void> {
    Deno.writeTextFile(this.path, JSON.stringify(this.data));
  }

  /**
   * function for get all of the contacts
   * @returns Contact[]
   */
  get(): Contact[] {
    return this.data;
  }

  /**
   * Function for create a new contact
   * @param contact Contact
   * @returns string
   */
  create(contact: Contact): string {
    // update the data
    this.data.push(contact);

    // write in the file
    this.write();

    return 'Contact created successfully';
  }
}
