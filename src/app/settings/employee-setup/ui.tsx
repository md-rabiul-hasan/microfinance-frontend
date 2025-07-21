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
import EditModal from './edit'
import { deleteEmployee } from '@actions/settings/employee-config'

// Define the props type

const EmployeeListPageUi = ({ data: { data, pagination } }: any) => {
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

  const addHandler = () =>
    openModal({
      children: <AddModal />,
      centered: true,
      withCloseButton: false
    })

  const editHandler = (employee: any) =>
    openModal({
      children: <EditModal employee={employee} />,
      centered: true,
      withCloseButton: false
    })

  const deleteHandler = (id: number) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this employee?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteEmployee(id)
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
        <TitleBar title="Employee List" url="/" />
        <Group gap="xs">
          <TextInput
            placeholder="Search Employee List"
            miw={400}
            value={interSearch}
            onChange={(event) => setInterSearch(event.currentTarget.value)}
          />
          <Tooltip label="Add New Employee" withArrow position="bottom">
            <ActionIcon onClick={addHandler}>
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
              <Table.Th>Employee ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Designation</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.length > 0 ? (
              data.map((employee: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{employee.emp_id}</Table.Td>
                  <Table.Td>{employee.name}</Table.Td>
                  <Table.Td>{employee.designation}</Table.Td>
                  <Table.Td>{employee.contact}</Table.Td>
                  <Table.Td>{employee.addr}</Table.Td>
                  <Table.Td>
                    <Menu withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <MoreIcon />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => editHandler(employee)}>Edit</Menu.Item>
                        <Menu.Item onClick={() => deleteHandler(employee.keyCode)}>Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} align="center">
                  Employee not found
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination Controls */}
      <TableNav
        listName="Employees"
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

export default EmployeeListPageUi
