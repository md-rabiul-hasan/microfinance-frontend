import { getLocationList } from '@actions/common-config'
import { getServiceAreaList } from '@actions/service-area-config'
import ServiceAreaListPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const ServiceAreaPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getServiceAreaList({ page, per_page, search })
  const locations = await getLocationList();

  return <ServiceAreaListPageUi data={res} locations={locations} />
}

export default ServiceAreaPage