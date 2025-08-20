import { getLoanDeletePendingList } from '@actions/loan-processing/delete-loan-config'
import DeleteLoanAuthPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const DeleteLoanAuthPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getLoanDeletePendingList({ page, per_page, search })

  return <DeleteLoanAuthPageUi data={res} />
}

export default DeleteLoanAuthPage
