import { getAddressZones, getBloodGroups, getProfessions, getReligions } from '@actions/common-config'
import AddMemberUi from './ui'

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

  const religions = await getReligions();
  const bloodGroups = await getBloodGroups();
  const professions = await getProfessions();
  const addressZones = await getAddressZones();

  return <AddMemberUi religions={religions} bloodGroups={bloodGroups} professions={professions} addressZones={addressZones} />
}

export default MemberSetupPage
