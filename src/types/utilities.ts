
export type TPaginatedRes<T> = {
  data: T[]
  paginationInfo?: {
    totalRecords: number
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}