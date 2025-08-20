'use client'

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
import { deleteServiceArea } from '@actions/settings/service-area-config'
import { getLoanType } from '@utils/utils'
import { authorizeDeleteLoanRequest, rejectDeleteLoanRequest } from '@actions/loan-processing/delete-loan-config'

// Define the props type

const DeleteLoanAuthPageUi = ({ data: { data, pagination } }: any) => {
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

  const authorizeHandler = (keyCode: any, loan_id: any) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to authorize this loan delete request?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await authorizeDeleteLoanRequest(keyCode, loan_id)
          if (res.success) {
            showNotification({ ...getSuccessMessage(res.message), autoClose: 10000 })
          } else {
            showNotification(getErrorMessage(res.message))
          }
        })
      }
    })
  }

  const rejectHandler = (keyCode: any, loan_id: any) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to reject this loan delete request?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await rejectDeleteLoanRequest(keyCode, loan_id)
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
        <TitleBar title="Loan Admin || Delete Loan Auth" url="/" />
        <Group gap="xs">
          <TextInput
            placeholder="Search Here"
            miw={400}
            value={interSearch}
            onChange={(event) => setInterSearch(event.currentTarget.value)}
          />
        </Group>
      </Group>

      {/* Product Table */}
      <Paper shadow="xs" mb="xs">
        <Table verticalSpacing={8} horizontalSpacing={8} striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SL</Table.Th>
              <Table.Th>Loan ID</Table.Th>
              <Table.Th>Loan Type</Table.Th>
              <Table.Th>Loan Account</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Disburse Date</Table.Th>
              <Table.Th>Deleted By</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.length > 0 ? (
              data.map((loan: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td tt="uppercase">{loan?.loan_id || 'N/A'}</Table.Td>
                  <Table.Td>{getLoanType(loan?.loan_info?.sales_type)}</Table.Td>
                  <Table.Td>{loan?.loan_info?.account_info?.acc_name || 'N/A'}</Table.Td>
                  <Table.Td>{loan?.loan_info?.LnAmount || '0.00'}</Table.Td>
                  <Table.Td>{loan?.loan_info?.disburseDate || 'N/A'}</Table.Td>
                  <Table.Td>
                    {loan?.maker?.user_id || 'Unknown'} - {loan?.make_date || 'N/A'} - {loan?.make_time || 'N/A'}
                  </Table.Td>
                  <Table.Td>
                    <Menu withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <MoreIcon />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          onClick={() => authorizeHandler(loan?.keyCode, loan?.loan_id)}
                          disabled={!loan?.keyCode || !loan?.loan_id}
                        >
                          Authorize
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => rejectHandler(loan?.keyCode, loan?.loan_id)}
                          disabled={!loan?.keyCode || !loan?.loan_id}
                        >
                          Reject
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} align="center">
                  Loan delete request not found
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination Controls */}
      <TableNav
        listName="Loan Delete Requests"
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

export default DeleteLoanAuthPageUi
