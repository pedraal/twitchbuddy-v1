interface PaginatedFetchOptions {
  cacheKey: string
  limit: number
  query: Record<string, string | number>
  server: boolean
}

interface PaginatedResponse<T> {
  pagination: {
    cursor: string
  }
  data: T[]
}

export default async function usePaginatedFetch<T>(url: string, options: PaginatedFetchOptions) {
  const limit = options.limit || 100
  const server = options.server || false

  const resources = ref<T[]>([]) as Ref<T[]>
  const cursor = ref<string | null>()

  const cacheKey = computed(() => {
    return [url, options.cacheKey, cursor.value].join('-')
  })

  function fetch(): Promise<PaginatedResponse<T>> {
    return $fetch(url, {
      query: { ...options.query, limit, cursor: cursor.value },
    })
  }

  const { pending, data: response, execute } = await useLazyAsyncData(cacheKey.value, () => {
    return fetch()
  }, {
    server,
  })

  watch(response, (value) => {
    if (!value || (cursor.value && value.pagination.cursor === cursor.value))
      return

    resources.value = [...resources.value, ...value.data]

    if (value.data.length < limit)
      cursor.value = null
    else
      cursor.value = value.pagination.cursor
  })

  return {
    resources,
    cursor,
    pending,
    execute,
  }
}
