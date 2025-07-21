export interface IBranch {
  id: number;
  name: string;
  location: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IBranchCreate {
  name: string;
  location: string;
  code: string;
}

export interface IBranchUpdate {
  name?: string;
  location?: string;
  code?: string;
} 