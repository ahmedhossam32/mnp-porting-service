export interface CreatePortingRequestDto {
  phoneNumber: string;
}

export interface PortingRequestResponseDto {
  id: number;
  phoneNumber: string;
  recipientOperator: string;
  donorOperator: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
}
