import { getExternalSavingAccount } from '@actions/external-saving-account-config'
import ExternalSavingAccountListUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const ExternalSavingAccountListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getExternalSavingAccount({ page, per_page, search })

  return <ExternalSavingAccountListUi data={res} />
}

export default ExternalSavingAccountListPage
