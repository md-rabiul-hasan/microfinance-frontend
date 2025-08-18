import { getWithdrawalGeneralAccounts } from '@actions/withdrawal/withdrawal-amount-config'
import DeleteLoanPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const DeleteLoanPage = async ({ searchParams }: Props) => {
  const accounts = await getWithdrawalGeneralAccounts()

  return <DeleteLoanPageUi accounts={accounts} />
}

export default DeleteLoanPage
