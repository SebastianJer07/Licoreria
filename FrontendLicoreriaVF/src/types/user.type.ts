import IUserRole from "./IUserRole";

export default interface IUser {
  id?: any | null,
  username: string,
  email: string,
  password: string,
  roles?: Array<string>
   
}
/*roles?: Array<string>,*/