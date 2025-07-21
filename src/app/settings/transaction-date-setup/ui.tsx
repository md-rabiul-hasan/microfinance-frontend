'use client'

import TitleBar from '@components/common/title-bar'
import { ActionIcon, Container, Group, Paper, Table, Tooltip } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { MdOutlineSettings } from 'react-icons/md'
import EditModal from './edit'
import { formatDate, formatDateTime, formatDateTimeGMT } from '@utils/datetime.util'

const TransactionDateUi = ({ data }: any) => {
  const editHandler = () => {
    openModal({
      children: <EditModal formatCode={data?.data?.trnDate || ''} />,
      centered: true,
      withCloseButton: false
    })
  }

  return (
    <Container>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        <TitleBar title="Transaction Date Setup" url="/" />
        <Group gap="xs">
          <Tooltip label="Setup Transaction Date" withArrow position="bottom">
            <ActionIcon onClick={editHandler}>
              <MdOutlineSettings />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Conditionally render the table only if formatCode exists */}
      {data?.data?.trnDate !== undefined && (
        <Paper shadow="xs" mb="xs">
          <Table variant="vertical" layout="fixed" withTableBorder>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={160}>Transaction Date</Table.Th>
                <Table.Td>{formatDate(data.data.trnDate)}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Container>
  )
}

export default TransactionDateUi
