export type CreateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
};

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
};