import { getExternalSavingAccountList } from '@actions/basic-accounting/external-saving-account-transaction-config'
import ExternalSavingAccountTransactionPageUi from './ui'


const ExternalSavingAccountTransactionPage = async () => {
  const accounts = await getExternalSavingAccountList()
  return <ExternalSavingAccountTransactionPageUi accounts={accounts} />
}

export default ExternalSavingAccountTransactionPage
