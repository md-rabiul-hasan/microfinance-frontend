import { getBankAccountList } from '@actions/bank-account-config'
import BankAccountListPageUi from './ui'
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

const BankAccountListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getBankAccountList({ page, per_page, search })

  return <BankAccountListPageUi data={res} />
}

export default BankAccountListPage
