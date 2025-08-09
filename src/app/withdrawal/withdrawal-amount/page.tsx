import { getWithdrawalGeneralAccounts } from '@actions/withdrawal/withdrawal-amount-config'
import WithdrawalPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const WithdrawalPage = async ({ searchParams }: Props) => {
  const accounts = await getWithdrawalGeneralAccounts()

  return <WithdrawalPageUi accounts={accounts} />
}

export default WithdrawalPage
