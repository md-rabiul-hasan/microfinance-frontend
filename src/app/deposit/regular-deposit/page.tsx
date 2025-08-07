import { getLocationList } from '@actions/common-config'
import { getMyMemberList } from '@actions/membership/my-member-config'
import RegularDepositPageUi from './ui'
import { getDepositGeneralAccounts } from '@actions/deposit/regular-deposit-config'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const RegularDepositPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getMyMemberList({ page, per_page, search })
  const accounts = await getDepositGeneralAccounts()

  return <RegularDepositPageUi data={res} accounts={accounts} />
}

export default RegularDepositPage
