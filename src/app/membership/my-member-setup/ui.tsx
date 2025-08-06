'use client'

import { deleteServiceArea } from '@actions/settings/service-area-config'
import TableNav from '@components/common/table-nav'
import TitleBar from '@components/common/title-bar'
import useNavigation from '@hooks/useNavigation'
import { ActionIcon, Container, Group, Menu, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { modals, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import AddModal from './add'
import EditModal from './upload'
import { deleteMember } from '@actions/membership/my-member-config'
import UploadModal from './upload'

// Define the props type

const MemberListPageUi = ({ data: { data, pagination }, locations }: any) => {
  const router = useRouter() // Use Next.js router for navigation
  // Get search parameters and navigation function
  const searchParams = useSearchParams()
  const { navigate } = useNavigation()

  // Manage search input state
  const [interSearch, setInterSearch] = useState(searchParams.get('search') || '')
  const [search] = useDebouncedValue(interSearch, 400) // Debounce search input

  // Retrieve pagination parameters from URL
  const page = Number(searchParams.get('page')) || 1
  const limit = searchParams.get('per_page') || '10'

  // Handle pagination and search changes
  const handlePageChange = (val: number) => navigate({ page: val.toString() })
  const handleLimitChange = (val: string | null) => navigate({ per_page: val || '10' })

  const editHandler = (id: any) => {
    router.push(`/membership/my-member-setup/add?id=${id}`)
  }

  const uploadHandler = (memberKeyCode: any) =>
    openModal({
      children: <UploadModal memberKeyCode={memberKeyCode} />,
      centered: true,
      withCloseButton: false
    })

  const deleteHandler = (id: number) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this member?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteMember(id)
          if (res.success) {
            showNotification({ ...getSuccessMessage(res.message), autoClose: 10000 })
          } else {
            showNotification(getErrorMessage(res.message))
          }
        })
      }
    })
  }

  // Update the search query in URL whenever `search` changes
  useEffect(() => {
    navigate({ search, page: '1' }) // Reset to page 1 on search
  }, [search])

  return (
    <Container fluid>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        <TitleBar title="My Member List" url="/" />
        <Group gap="xs">
          <TextInput
            placeholder="Search Member"
            miw={400}
            value={interSearch}
            onChange={(event) => setInterSearch(event.currentTarget.value)}
          />
          <Tooltip label="Add New Area" withArrow position="bottom">
            <ActionIcon onClick={() => router.push('/membership/my-member-setup/add')}>
              <FaPlusCircle />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Product Table */}
      <Paper shadow="xs" mb="xs">
        <Table verticalSpacing={8} horizontalSpacing={8} striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SL</Table.Th>
              <Table.Th>Mem ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>National/Birth ID</Table.Th>
              <Table.Th>Zone</Table.Th>
              <Table.Th>Member Date</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.length > 0 ? (
              data.map((member: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{member.member_id}</Table.Td>
                  <Table.Td tt="uppercase">
                    {member?.gender === 'M' ? 'Mr. ' : member?.gender === 'F' ? 'Ms. ' : ''}
                    {member?.name || 'N/A'}
                  </Table.Td>
                  <Table.Td>{member.contact}</Table.Td>
                  <Table.Td>{member.national_id}</Table.Td>
                  <Table.Td>{member?.address_zone?.zoneName ?? '-'}</Table.Td>
                  <Table.Td>{member.mem_date}</Table.Td>
                  <Table.Td>
                    <Menu withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <MoreIcon />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => editHandler(member.memberKeyCode)}>Edit</Menu.Item>
                        <Menu.Item onClick={() => uploadHandler(member.memberKeyCode)}>Image Upload</Menu.Item>
                        <Menu.Item onClick={() => deleteHandler(member.memberKeyCode)}>Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} align="center">
                  Member Not Found
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination Controls */}
      <TableNav
        listName="Members"
        limit={limit}
        limitHandler={handleLimitChange}
        page={pagination?.current_page!}
        pageHandler={handlePageChange}
        totalPages={pagination?.last_page!}
        totalRecords={pagination?.total!}
      />
    </Container>
  )
}

export default MemberListPageUi
