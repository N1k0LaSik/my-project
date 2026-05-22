export type CreateStatusRequestDto = {
  name: string;
  color: string;
};

export type UpdateStatusRequestDto = {
  name?: string;
  color?: string;
};

export type StatusResponseDto = {
  id: string;
  name: string;
  color: string;
};