import { getDepositGeneralAccounts } from '@actions/deposit/regular-deposit-config'
import RegularDepositPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const RegularDepositPage = async ({ searchParams }: Props) => {
  const accounts = await getDepositGeneralAccounts()

  return <RegularDepositPageUi accounts={accounts} />
}

export default RegularDepositPage
