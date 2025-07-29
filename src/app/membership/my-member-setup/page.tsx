import { getLocationList } from '@actions/common-config'
import { getMyMemberList } from '@actions/membership/my-member-config'
import MemberListPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const MemberSetupPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getMyMemberList({ page, per_page, search })
  const locations = await getLocationList()

  return <MemberListPageUi data={res} locations={locations} />
}

export default MemberSetupPage
