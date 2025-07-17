'use client'

import TitleBar from '@components/common/title-bar'
import { ActionIcon, Container, Group, Paper, Table, Tooltip } from '@mantine/core'
import { MdOutlineSettings } from 'react-icons/md'
import Image from 'next/image' // Import Next.js Image component
import { openModal } from '@mantine/modals'
import EditModal from './edit'

const CompanyInfoUi = ({ data }: any) => {
  const editHandler = (company: any) =>
    openModal({
      children: <EditModal company={company} />,
      centered: true,
      withCloseButton: false
    })

  return (
    <Container>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        <TitleBar title="Company Setup" url="/" />
        <Group gap="xs">
          <Tooltip label="Setup Company" withArrow position="bottom">
            <ActionIcon onClick={() => editHandler(data.data ?? null)}>
              <MdOutlineSettings />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Product Table */}
      <Paper shadow="xs" mb="xs">
        <Table variant="vertical" layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Company Name</Table.Th>
              <Table.Td>{data.data.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th w={160}>Short Name</Table.Th>
              <Table.Td>{data.data.sName}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th w={160}>Address</Table.Th>
              <Table.Td>{data.data.addr}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th w={160}>Image</Table.Th>
              <Table.Td>
                {data.data.logo_file ? (
                  <div style={{ width: '150px', height: '150px', position: 'relative' }}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_API_FILE_URL}${data.data.logo_file}`}
                      alt="Company Logo"
                      fill
                      style={{ objectFit: 'contain' }}
                      // Add unoptimized if you're using external URLs that Next.js can't optimize
                      unoptimized={process.env.NODE_ENV !== 'production'} // Only optimize in production
                    />
                  </div>
                ) : (
                  'No logo available'
                )}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  )
}

export default CompanyInfoUi
