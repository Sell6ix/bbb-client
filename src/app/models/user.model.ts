import { AppType } from "./enums";

export interface User {
  id: string;
  username: string;
  role: 'BRO' | AppType;
}