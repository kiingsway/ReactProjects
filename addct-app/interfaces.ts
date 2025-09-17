import dayjs from 'dayjs';

export interface IAddctItem {
  Title: string;
  Date: string;
  Quantity: number;
}

export interface IAddctType {
  id: string;
  Points: number;
  Nome: string;
}

export interface IAddctItemForm extends Omit<IAddctItem, 'Date'> {
  Date: dayjs.Dayjs;
}