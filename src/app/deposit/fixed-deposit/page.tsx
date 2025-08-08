import FdrDepositPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const FdrDepositPage = async ({ searchParams }: Props) => {
  return <FdrDepositPageUi />
}

export default FdrDepositPage
