import fs from 'fs/promises';
import { IUser } from '../interfaces';

export default class DB {
  DB: string;
  DOCUMENT: string;

  constructor(db: string, document: string) {
    this.DB = db;
    this.DOCUMENT = document;
  }

  async find(page?: number, limit?: number): Promise<any[]> {
    return fs.readFile(this.DB, { encoding: 'utf8' })
      .then(json => JSON.parse(json))
      .then(data => data[this.DOCUMENT])
      .then((items: any[]) => {
        if (page) items = items.filter((item, i) => i + 1 > ((page - 1) * limit) && i + 1 <= ((page - 1) * limit + limit));
        return items;
      });
  }

  async findByIdAndUpdate(id: any, newData: any): Promise<any> {
    let result: any;
    let items = await this.find();
    items = items.map(item => {

      if (item.id === id) {
        result = Object.assign(item, newData);
        return result;
      }

      return item;
    });
    if (result) {
      await fs.writeFile(this.DB, JSON.stringify({ [this.DOCUMENT]: items }, null, 3), 'utf8');
    }

    return result || null;
  }

  async findOne(conditions: any): Promise<any> {
    let item;
    const items = await this.find();
    if (Object.keys(conditions).length || items.length) {
      item = Object.keys(conditions).reduce((items, key) => {
        return items.filter(item => item[key] === conditions[key]);
      }, [...items])[0];
    }
    return item || null;
  }

  // paginate (page: number, limit: number) {
  //   return this.items = this.items.filter((item, i) => {
  //     return i + 1 > (page * limit) && i + 1 < (page * limit + limit)
  //   })
  // }
  //
  // filter (conditions: any) {
  //   if (Object.keys(conditions).length || this.items.length) {
  //     this.items = Object.keys(conditions).reduce((items, key) => {
  //       return items.filter(item => item[key] === conditions[key]);
  //     }, [...this.items]);
  //   }
  //   return this.items
  // }

  async getCount(): Promise<number> {
    const items = await this.find();
    return items.length;
  }

  async create(item: any): Promise<any> {
    let items = await this.find();
    items = [...items, { ...item }];
    return fs.writeFile(this.DB, JSON.stringify({ [this.DOCUMENT]: items }, null, 3), { encoding: 'utf8' })
      .then(() => item);
  }
}