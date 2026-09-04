export interface PhoneStatusResponseDto {
  phoneNumber: string;
  currentHolder: string;
  activeRequestStatus: string | null;
}
