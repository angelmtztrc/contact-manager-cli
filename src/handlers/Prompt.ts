import { nanoid } from 'https://deno.land/x/nanoid/async.ts';
import { Select } from 'https://deno.land/x/cliffy/prompt/select.ts';
import { Table } from 'https://deno.land/x/cliffy/table/mod.ts';
import { Input } from 'https://deno.land/x/cliffy/prompt/input.ts';

import { Manager } from '../handlers/Manager.ts';
import { Contact } from '../interfaces/Contact.ts';

export class Prompt {
  private manager: Manager;

  constructor() {
    this.manager = new Manager();
    this.initialize();
  }

  async initialize(): Promise<void> {
    const option: string = await Select.prompt({
      message: 'What would you like to do?',
      options: [
        {
          name: 'See contacts',
          value: 'GET_ALL'
        },
        {
          name: 'Find a contact',
          value: 'FIND_ONE'
        },
        {
          name: 'Create a new contact',
          value: 'CREATE'
        },
        {
          name: 'Update a contact',
          value: 'UPDATE'
        },
        {
          name: 'Delete a contact',
          value: 'DELETE'
        },
        {
          name: 'Exit',
          value: 'EXIT'
        }
      ]
    });
    this.choosedOperation(option);
  }

  choosedOperation(option: string): void {
    switch (option) {
      case 'GET_ALL':
        this.getAll();
        break;
      case 'CREATE':
        this.createAContact();
      default:
        break;
    }
  }

  getAll(): void {
    const rows: string[][] = [];

    // convert to a topple for display in a table
    this.manager.get().forEach((contact: Contact) => {
      rows.push(Object.values(contact));
    });

    // set up the table
    new Table()
      .header(['ID', 'Name', 'Email', 'Cellphone'])
      .body(rows)
      .padding(1)
      .indent(2)
      .border(true)
      .render();

    // print an space
    this.printSpace();

    // initialize again
    this.initialize();
  }

  async createAContact(): Promise<void> {
    // get the name of the contact
    const name = await Input.prompt("What's the name of the new contact?");

    // get the email of the contact
    const email = await Input.prompt("What's the email of the new contact?");

    // get the cellphone of the contact
    const cellphone = await Input.prompt("What's the cellphone of the new contact?");

    // create the contact
    console.info(this.manager.create({ id: await nanoid(8), name, email, cellphone }));

    this.printSpace();

    // re initialize
    this.initialize();
  }

  exit(): void {
    Deno.exit();
  }

  printSpace(): void {
    console.log('\n');
  }
}
