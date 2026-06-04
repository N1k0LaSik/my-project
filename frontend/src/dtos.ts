export type TicketPriority = "Low" | "Medium" | "High";

export interface StatusDto {
  id: string;
  name: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface TicketListItemDto {
  id: string;
  subject: string;
  priority: TicketPriority;
  statusId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetailDto extends TicketListItemDto {
  message: string;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
  priority: TicketPriority;
  statusId: string;
  authorId: string;
}

export interface UpdateTicketDto {
  subject?: string;
  message?: string;
  priority?: TicketPriority;
  statusId?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: string;
  errors?: Array<{ field?: string; message: string }>;
}