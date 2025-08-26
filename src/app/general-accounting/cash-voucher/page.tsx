import CashVoucherPageUi from './ui'
import JournalEntryPageUi from './ui'
import { getCashVoucherAccountHeadList } from '@actions/general-accounting/cash-voucher-config'

const JournalEntryPage = async () => {
  const accounts = await getCashVoucherAccountHeadList()
  return <CashVoucherPageUi accounts={accounts} />
}

export default JournalEntryPage
