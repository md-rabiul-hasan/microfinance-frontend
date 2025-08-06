import { getAddressZones, getBloodGroups, getMembers, getProfessions, getReligions } from '@actions/common-config'
import AddMemberUi from './ui'
import { detailsMemberInfo } from '@actions/membership/my-member-config'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
  id?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const MemberSetupPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '', id = '' } = params
  var details = null
  if (id) {
    const data = await detailsMemberInfo(id)
    details = data.data
  }

  const religions = await getReligions()
  const bloodGroups = await getBloodGroups()
  const professions = await getProfessions()
  const addressZones = await getAddressZones()
  const members = await getMembers()

  return (
    <AddMemberUi
      religions={religions}
      bloodGroups={bloodGroups}
      professions={professions}
      addressZones={addressZones}
      members={members}
      details={details}
    />
  )
}

export default MemberSetupPage
