import type { QueryValue } from 'ufo'

export default function useQueryParamsHelpers() {
  function safeQueryParamString(param: QueryValue | QueryValue[]) {
    if (!param || typeof param === 'object')
      return ''
    else if (Array.isArray(param))
      return param.join(',')
    else if (typeof param === 'number')
      return param.toString()
    else
      return param
  }

  return { safeQueryParamString }
}
