import { getDifferentProjectAccountList } from '@actions/basic-accounting/different-project-transaction-config'
import DifferentProjectTransactionPageUi from './ui'


const DifferentProjectTransactionPage = async () => {
  const accounts = await getDifferentProjectAccountList()
  return <DifferentProjectTransactionPageUi accounts={accounts} />
}

export default DifferentProjectTransactionPage
