export interface DynamicInterface {
  id: string;
  name: string;
  createdAt: string;
}

export interface PaginatedResponse {
  items: DynamicInterface[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
