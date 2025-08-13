import {
  getKarzEHasanLoanAccountList,
  getKarzEHasanLoanApprovarComitteeList
} from '@actions/loan-processing/karz-e-hasanah-config'
import KarzEHasanahPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const KarzEHasanahPage = async ({ searchParams }: Props) => {
  const accounts = await getKarzEHasanLoanAccountList()
  const approvars = await getKarzEHasanLoanApprovarComitteeList()

  return <KarzEHasanahPageUi accounts={accounts} approvars={approvars} />
}

export default KarzEHasanahPage
