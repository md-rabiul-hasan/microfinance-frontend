import { getBranchList } from '@actions/settings/branch-config'
import PurchaseItemListPageUi from './ui'
import { getPurchaseItemList } from '@actions/loan-processing/purchase-item-config'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const PurchaseItemListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getPurchaseItemList({ page, per_page, search })

  return <PurchaseItemListPageUi data={res} />
}

export default PurchaseItemListPage
