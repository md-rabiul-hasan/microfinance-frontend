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
import { getPermissionUserList } from '@actions/user-and-security/user-permission'
import UserPermissionPageUi from './ui'

const UserPermissionPage = async () => {
  const res = await getPermissionUserList()

  return <UserPermissionPageUi users={res} />
}

export default UserPermissionPage
