import {Role} from './Role'
import { Status } from './Status';
export class User {
    id!: number;
    username!: string;
    email!: string;
    password!: string;
    specialty?: string;
    status?: Status;
    roles!: Role[];
  
   
  }
  
  
  
  
  