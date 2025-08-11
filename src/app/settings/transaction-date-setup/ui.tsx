'use client'

import TitleBar from '@components/common/title-bar'
import { ActionIcon, Container, Group, Paper, Table, Tooltip } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { formatDate } from '@utils/datetime.util'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useEffect, useState } from 'react'
import { MdOutlineSettings } from 'react-icons/md'
import EditModal from './edit'

const TransactionDateUi = ({ data }: any) => {
  const [sessionDate, setSessionDate] = useState<Date | null>(null)

  // Get session date on component mount
  useEffect(() => {
    const date = getSessionTransactionDate()
    setSessionDate(date)
  }, [])

  const handleUpdateSuccess = (newDate: Date) => {
    setSessionDate(newDate);
  };

  const editHandler = () => {
    openModal({
      children: <EditModal
        trnDate={sessionDate || data?.data?.trnDate}
        onSuccess={handleUpdateSuccess}
      />,
      centered: true,
      withCloseButton: false
    })
  }

  return (
    <Container>
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

      <Paper shadow="xs" mb="xs">
        <Table variant="vertical" layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Transaction Date</Table.Th>
              <Table.Td>
                {sessionDate ? formatDate(sessionDate) :
                  data?.data?.trnDate ? formatDate(new Date(data.data.trnDate)) :
                    'Loading...'}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  )
}

export default TransactionDateUi