export interface Login {
  users: Users;
  access_token: string;
}
export interface Users {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}
