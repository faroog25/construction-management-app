
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
  // For backward compatibility
  name?: string;
  phone?: string;
  address?: string;
}
