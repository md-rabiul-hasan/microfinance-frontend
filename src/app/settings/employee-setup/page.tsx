import EmployeeListPageUi from './ui'
import { getEmployeeList } from '@actions/employee-config'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const EmployeeListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getEmployeeList({ page, per_page, search })

  return <EmployeeListPageUi data={res} />
}

export default EmployeeListPage
