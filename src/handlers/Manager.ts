import { ensureFileSync } from 'https://deno.land/std@0.90.0/fs/mod.ts';
import { Contact } from '../interfaces/Contact.ts';

export class Manager {
  private data: Contact[] = [];
  private pathname: string;

  constructor() {
    this.pathname = './directory.json';
    this.start();
  }

  /**
   * Start the manager by finding/creating a json file
   */
  start(): void {
    // Find/create a json file to store our contacts
    ensureFileSync(this.pathname);
    this.read();
  }

  /**
   * Read the data of the json file
   */
  async read(): Promise<void> {
    const fileContent = await Deno.readTextFile(this.pathname);

    if (fileContent === '') {
      this.data = [];
    } else {
      this.data = await JSON.parse(fileContent);
    }
  }

  /**
   * Write new changes in the json file
   */
  write(): void {
    Deno.writeTextFile(this.pathname, JSON.stringify(this.data));
  }

  /**
   * function for get all of the contacts
   * @returns Contact[]
   */
  get(): Contact[] {
    return this.data;
  }

  /**
   * Function for find a specify contact
   * @param name string
   * @returns Contact
   */
  findOne(name: string): Contact | string {
    const contact = this.data.find((item: Contact) => item.name === name);

    if (contact) {
      return contact;
    } else {
      return 'Contact not found';
    }
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

  remove(id: string): string {
    // find the contact
    const exists = this.data.find((item: Contact) => item.id === id);

    if (exists) {
      // remove the contact
      this.data = [...this.data.filter((contact: Contact) => contact.id !== id)];

      // update the json file
      this.write();

      return 'Contact removed successfully';
    } else {
      return 'Contact not found';
    }
  }
}
