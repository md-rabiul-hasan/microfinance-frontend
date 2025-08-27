import { getChartOfAccountList } from '@actions/general-accounting/account-setup-config'
import AccountSetupUi from './ui'

const AccountSetupPage = async () => {
  const accounts = await getChartOfAccountList()
  return <AccountSetupUi accounts={accounts} />
}

export default AccountSetupPage
