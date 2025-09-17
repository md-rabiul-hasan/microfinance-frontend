import { getLocationList } from '@actions/common-config'
import { getMyMemberList } from '@actions/membership/my-member-config'
import AdminUi from './home/admin-ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const Home = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getMyMemberList({ page, per_page, search })
  const locations = await getLocationList()

  return <AdminUi data={res} locations={locations} />
}

export default Home

