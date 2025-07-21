import FiscalYearUi from './ui'
import { getTransactionDate } from '@actions/settings/transaction-date-config'

const TransactionDatePage = async () => {
  const res = await getTransactionDate()
  return <FiscalYearUi data={res} />
}

export default TransactionDatePage
