import {
  getKarzEHasanLoanAccountList,
  getKarzEHasanLoanApprovarComitteeList
} from '@actions/loan-processing/karz-e-hasanah-config'
import SaleMudarabaPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const SaleMudarabaPage = async ({ searchParams }: Props) => {
  const accounts = await getKarzEHasanLoanAccountList()
  const approvars = await getKarzEHasanLoanApprovarComitteeList()

  return <SaleMudarabaPageUi accounts={accounts} approvars={approvars} />
}

export default SaleMudarabaPage
