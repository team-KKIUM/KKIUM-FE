export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T | null;
}

export interface ApiErrorPayload {
  status: number;
  code: string;
  message: string;
}
