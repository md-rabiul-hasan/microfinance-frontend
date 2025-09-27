'use client'

import { getUserMenuList, userMenuPermissionUpdate } from '@actions/user-and-security/user-permission'
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Text
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { usePermissions } from '@utils/permission'
import { useState } from 'react'
import { BiCategoryAlt, BiSearch } from 'react-icons/bi'
import { FaChevronDown, FaChevronRight, FaLock, FaLockOpen } from 'react-icons/fa'

interface User {
  value: string
  label: string
}

interface MenuItem {
  id: string
  name: string
  isParent: string
  type: 'group' | 'item'
  hasPermission?: boolean
  permissionId?: string | null
  children?: MenuItem[]
  indent: number
}

const UserPermissionPageUi = ({ users }: { users: User[] }) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [menuData, setMenuData] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [updating, setUpdating] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [userKey, setUserKey] = useState('0')

  const toggleGroup = (menuId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      newSet.has(menuId) ? newSet.delete(menuId) : newSet.add(menuId)
      return newSet
    })
  }

  const handleMenuClick = async (menu: MenuItem) => {
    if (menu.type === 'group') {
      toggleGroup(menu.id)
      return
    }

    if (!userKey || userKey === '0') {
      showNotification(getErrorMessage('Please select a user first'))
      return
    }

    setUpdating(true)
    try {
      const formData = {
        user_key: userKey,
        menu: menu.id,
        status: !menu.hasPermission // Toggle the permission status
      }

      const res = await userMenuPermissionUpdate(formData)

      if (res.success) {
        showNotification(getSuccessMessage(res?.message || 'Permission updated successfully'))

        // Update the local state to reflect the change
        const updateMenuPermission = (menus: MenuItem[]): MenuItem[] => {
          return menus.map((item) => {
            if (item.id === menu.id) {
              return {
                ...item,
                hasPermission: !menu.hasPermission,
                permissionId: menu.hasPermission ? null : item.permissionId || 'new-permission'
              }
            }
            if (item.children) {
              return {
                ...item,
                children: updateMenuPermission(item.children)
              }
            }
            return item
          })
        }

        setMenuData((prev) => updateMenuPermission(prev))
      } else {
        showNotification(getErrorMessage(res?.message || 'Failed to update permission'))
      }
    } catch (err) {
      showNotification(getErrorMessage('Network error occurred while updating permission'))
    } finally {
      setUpdating(false)
    }
  }

  const handleSearchMember = async () => {
    if (!selectedUser) {
      setError('Please select a user first')
      return
    }

    setIsLoading(true)
    setError('')
    setExpandedGroups(new Set())

    try {
      const result = await getUserMenuList(selectedUser)

      if (result.success) {
        setMenuData(result.data.data || [])
        setUserKey(result.data.user_code || selectedUser)

        // Auto-expand all groups
        const groupIds = new Set<string>()
        const findGroups = (menus: MenuItem[]) => {
          menus.forEach((menu) => {
            if (menu.type === 'group') {
              groupIds.add(menu.id)
              menu.children && findGroups(menu.children)
            }
          })
        }
        findGroups(result.data.data || [])
        setExpandedGroups(groupIds)
      } else {
        setError(result.message || 'Failed to fetch menu data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const renderMenuTree = (menus: MenuItem[]) => {
    return menus.map((menu) => (
      <Box key={menu.id} ml={menu.indent * 16} mb={4}>
        {menu.type === 'group' ? (
          <Box>
            <Group
              p={8}
              bg={expandedGroups.has(menu.id) ? 'blue.0' : 'transparent'}
              style={{ borderRadius: 6, cursor: 'pointer', border: '1px solid #ddd' }}
              onClick={() => handleMenuClick(menu)}
            >
              {expandedGroups.has(menu.id) ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
              <Text fw="bold" size="sm" c="blue">
                {menu.name}
              </Text>
              <Badge size="xs" variant="light">
                {menu.children?.length}
              </Badge>
            </Group>

            <Collapse in={expandedGroups.has(menu.id)}>
              <Box ml={16} mt={4}>
                {menu.children && renderMenuTree(menu.children)}
              </Box>
            </Collapse>
          </Box>
        ) : (
          <Group
            p={8}
            style={{
              borderRadius: 6,
              cursor: updating ? 'not-allowed' : 'pointer',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              opacity: updating ? 0.7 : 1
            }}
            onClick={() => !updating && handleMenuClick(menu)}
          >
            {menu.hasPermission ? <FaLockOpen size={14} color="green" /> : <FaLock size={14} color="red" />}
            <Checkbox checked={menu.hasPermission || false} onChange={() => { }} disabled={updating} />
            <Text size="sm">{menu.name}</Text>
            {menu.hasPermission && (
              <Badge color="green" size="xs">
                Granted
              </Badge>
            )}
          </Group>
        )}
      </Box>
    ))
  }

  return (
    <Container size="lg">
      <Grid align="end" mb="md">
        <Grid.Col span={10}>
          <Select
            label="Select User"
            placeholder="Choose a user"
            data={users.map((user) => ({ value: String(user.value), label: user.label }))}
            searchable
            leftSection={<BiCategoryAlt />}
            value={selectedUser}
            onChange={(value) => {
              setSelectedUser(value || '')
              setError('')
              setMenuData([])
              setUserKey('0')
            }}
            error={error}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          {
            canUpdate ? (
              <Button
                onClick={handleSearchMember}
                loading={isLoading}
                leftSection={<BiSearch size={16} />}
                fullWidth
                disabled={!selectedUser}
              >
                Load
              </Button>
            ) : (
              <Button disabled fullWidth>
                You haven’t permission for setup user permission
              </Button>
            )
          }
        </Grid.Col>
      </Grid>

      <LoadingOverlay visible={isLoading || updating} />

      {menuData.length > 0 && (
        <Paper withBorder p="md">
          <Text fw="bold" size="lg" mb="md">
            Permissions for {users.find((u) => u.value === selectedUser)?.label}
          </Text>
          <Box style={{ maxHeight: '500px', overflowY: 'auto' }}>{renderMenuTree(menuData)}</Box>
        </Paper>
      )}

      {error && (
        <Alert color="red" mt="md">
          <Text size="sm">{error}</Text>
        </Alert>
      )}
    </Container>
  )
}

export default UserPermissionPageUi
