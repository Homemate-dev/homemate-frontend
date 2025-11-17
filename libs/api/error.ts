export type ApiError = {
  code: string
  message: string
  details?: { field: string; message: string }[]
  request_id?: string
  status?: number
  timestamp?: string
}

export function toApiError(e: any): ApiError {
  const res = e?.response

  const data = res?.data ?? e
  const err = data?.error ?? {}

  return {
    code: err.code ?? 'UNKNOWN',
    message: err.message ?? '오류가 발생했어요.',
    details: Array.isArray(err.details) ? err.details : undefined,
    request_id: err.request_id,
    status: res?.status,
    timestamp: data?.timestamp,
  }
}
