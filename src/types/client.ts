export enum ClientType {
  Individual = "Individual",
  Company = "Company"
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  clientType: ClientType;
  createdAt?: Date;
  updatedAt?: Date;
} 