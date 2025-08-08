import { getIrregularDepositGeneralAccounts } from '@actions/deposit/irregular-deposit-config'
import IrregularDepositPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const IrregularDepositPage = async ({ searchParams }: Props) => {
  const accounts = await getIrregularDepositGeneralAccounts()

  return <IrregularDepositPageUi accounts={accounts} />
}

export default IrregularDepositPage
