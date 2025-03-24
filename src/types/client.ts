export enum ClientType {
  Individual = "فرد",
  Company = "شركة"
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