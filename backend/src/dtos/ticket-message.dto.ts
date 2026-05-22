export type CreateTicketMessageRequestDto = {
  authorId: string;
  content: string;
};

export type TicketMessageResponseDto = {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: string;
};