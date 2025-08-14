import { getDepositGeneralAccounts } from '@actions/deposit/regular-deposit-config'
import RegularDepositPageUi from './ui'
import LoanCollectionPageUi from './ui'
import { getLoanCollectionAccounts } from '@actions/loan-processing/loan-collection-config'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const LoanCollectionPage = async ({ searchParams }: Props) => {
  const accounts = await getLoanCollectionAccounts()

  return <LoanCollectionPageUi accounts={accounts} />
}

export default LoanCollectionPage
