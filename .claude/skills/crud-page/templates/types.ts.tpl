export interface I__PascalSingular__ {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface I__PascalSingular__Create {
  name: string;
  status: string;
}

export interface I__PascalSingular__Update {
  name?: string;
  status?: string;
}
