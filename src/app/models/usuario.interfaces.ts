export interface Login {
  users: User;
  access_token: string;
}
export interface User {
  id?:number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  rol_usuario:string;
}
