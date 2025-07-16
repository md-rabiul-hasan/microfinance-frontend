import { getBranchList } from '@actions/branch-config'
import BranchListPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const BranchListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getBranchList({ page, per_page, search })

  return <BranchListPageUi data={res} />
}

export default BranchListPage
