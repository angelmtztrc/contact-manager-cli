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

  /**
   * Initialize the prompt
   */
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

  /**
   * Launch a question
   * @param option string
   */
  choosedOperation(option: string): void {
    switch (option) {
      case 'GET_ALL':
        this.getAll();
        break;
      case 'FIND_ONE':
        this.findOne();
        break;
      case 'CREATE':
        this.createAContact();
        break;
      case 'DELETE':
        this.deleteOne();
        break;
      default:
        break;
    }
  }

  /**
   * Function to get all contacts
   */
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

  /**
   * Function for find a contact - this prompt a question
   */
  async findOne(): Promise<void> {
    const suggestions: string[] = [];

    // create a array for suggestions
    this.manager.get().forEach((contact: Contact) => {
      suggestions.push(Object.values(contact)[1]);
    });

    // prompt the user for find a contact
    const requestedContact = await Input.prompt({
      message: 'Write a contact name',
      suggestions: suggestions
    });

    // find the contact in the json file
    const contact = this.manager.findOne(requestedContact);

    if (typeof contact === 'string') {
      // print a message if the contact is not found
      console.info(contact);
    } else {
      // print the data of the contact
      new Table()
        .header(['ID', 'Name', 'Email', 'Cellphone'])
        .body([Object.values(contact)])
        .padding(1)
        .indent(2)
        .border(true)
        .render();
    }

    // print an space
    this.printSpace();

    // initialize again
    this.initialize();
  }

  /**
   * Function for propmt questions for create a new contact
   */
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

  async deleteOne(): Promise<void> {
    const id = await Input.prompt("What's the ID of the contact that you try to remove?");

    // delete the contact
    const response = this.manager.remove(id);
    console.info(response);

    // print an space
    this.printSpace();

    // re initialize
    this.initialize();
  }

  /**
   * Function to exit the program
   */
  exit(): void {
    Deno.exit();
  }

  /**
   * Print an blank space
   */
  printSpace(): void {
    console.log('\n');
  }
}
