'use client'

import TableNav from '@components/common/table-nav'
import TitleBar from '@components/common/title-bar'
import useNavigation from '@hooks/useNavigation'
import { Container, Grid, Group, Paper, Table, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Define the props type

const AdminUi = ({ data: { data, pagination }, locations }: any) => {
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


  // Update the search query in URL whenever `search` changes
  useEffect(() => {
    navigate({ search, page: '1' }) // Reset to page 1 on search
  }, [search])

  return (
    <Container fluid>
      <Grid>
        {/* Main content area - 8 columns */}
        <Grid.Col span={8}>
          {/* Page title and search input */}
          <Group justify="space-between" mb="xs">
            <TitleBar title="Member Information" url="/" />
            <Group gap="xs">
              <TextInput
                placeholder="Search Member"
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
                  <Table.Th>Mem ID</Table.Th>
                  <Table.Th>Member Information</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Member Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.length > 0 ? (
                  data.map((member: any, index: number) => (
                    <Table.Tr key={index}>
                      <Table.Td>{index + 1}</Table.Td>
                      <Table.Td>{member.member_id}</Table.Td>
                      <Table.Td>{member.contact}</Table.Td>
                      <Table.Td>{member.national_id}</Table.Td>
                      <Table.Td>{member.mem_date}</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={5} align="center">
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
        </Grid.Col>

        {/* Empty sidebar - 4 columns */}
        <Grid.Col span={4}>
          {/* This area is intentionally left empty for now */}
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default AdminUi