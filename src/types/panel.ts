export interface IPanel {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  status: string;
}

export interface IPanelCreate {
  name: string;
  status: string;
}

export interface IPanelUpdate {
  name?: string;
  status?: string;
}
