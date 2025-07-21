import FiscalYearUi from './ui'
import { getTransactionDate } from '@actions/transaction-date-config'

const TransactionDatePage = async () => {
  const res = await getTransactionDate()
  return <FiscalYearUi data={res} />
}

export default TransactionDatePage
