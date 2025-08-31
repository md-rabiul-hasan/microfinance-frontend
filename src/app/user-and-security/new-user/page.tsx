import { getLocationList } from '@actions/common-config'
import ServiceAreaListPageUi from './ui'
import { getServiceAreaList } from '@actions/settings/service-area-config'
import {
  getUserBranchList,
  getUserEmployeeList,
  getUserList,
  getUserRoleList
} from '@actions/user-and-security/new-user-config'
import NewUserPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const NewUserPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getUserList({ page, per_page, search })
  const employees = await getUserEmployeeList()
  const branches = await getUserBranchList()
  const roles = await getUserRoleList()

  return <NewUserPageUi data={res} employees={employees} branches={branches} roles={roles} />
}

export default NewUserPage
