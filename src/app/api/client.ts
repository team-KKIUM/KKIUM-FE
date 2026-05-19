import type { ApiErrorPayload, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue>;
type ApiMethodOptions = Omit<ApiRequestOptions, 'body' | 'method'>;

// 함수들이 받을 요청 옵션 타입
interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  // fetch 옵션 + API client 전용 params/body 옵션
  params?: QueryParams;
  body?: unknown;
}

// API 요청이 실패했을 때 던질 커스텀 에러 클래스
export class ApiError extends Error {
  status: number;
  code: string;

  constructor({ status, code, message }: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// TODO: 로그인 구현 전까지 localStorage의 임시 accessToken을 사용한다.
function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('accessToken');
}

// API 요청 보낼 최종 URL을 만들어주는 함수
function buildUrl(path: string, params?: QueryParams) {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }

  const url = new URL(path, API_BASE_URL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value == null) return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

// API 요청 body를 fetch에 넣을 수 있는 형태로 바꿔주는 함수
function buildBody(body: unknown) {
  if (body == null) return undefined; // body가 없으면 undefined 반환
  if (body instanceof FormData) return body; // FormData는 stringify하면 안 됨
  return JSON.stringify(body);
}

// API 요청에 붙일 header들을 만들어주는 함수
function buildHeaders(body: unknown, headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  if (body != null && !(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  return nextHeaders;
}

// API 응답을 파싱해서 data만 반환하고, 에러는 ApiError로 던지는 함수
async function parseApiResponse<T>(response: Response): Promise<T> {
  let payload: ApiResponse<T> | null = null;

  try {
    const contentType = response.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      payload = (await response.json()) as ApiResponse<T>;
    }
  } catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.code !== 'SUCCESS') {
    throw new ApiError({
      status: payload?.status ?? response.status,
      code: payload?.code ?? 'UNKNOWN_ERROR',
      message: payload?.message ?? '요청 처리 중 오류가 발생했습니다.',
    });
  }

  return payload.data;
}

// 최종적으로 fetch를 호출하고 응답을 파싱해주는 메인 함수
async function request<T>(path: string, options: ApiRequestOptions = {}) {
  const { params, body, headers, ...init } = options;
  const response = await fetch(buildUrl(path, params), {
    ...init,
    body: buildBody(body),
    headers: buildHeaders(body, headers),
  });

  return parseApiResponse<T>(response);
}

// 편의를 위해 메서드별로 export 하는 객체
export const api = {
  get<T>(path: string, options?: ApiMethodOptions) {
    return request<T>(path, { ...options, method: 'GET' });
  },
  post<T>(path: string, body?: unknown, options?: ApiMethodOptions) {
    return request<T>(path, { ...options, method: 'POST', body });
  },
  put<T>(path: string, body?: unknown, options?: ApiMethodOptions) {
    return request<T>(path, { ...options, method: 'PUT', body });
  },
  patch<T>(path: string, body?: unknown, options?: ApiMethodOptions) {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },
  delete<T>(path: string, options?: ApiMethodOptions) {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
