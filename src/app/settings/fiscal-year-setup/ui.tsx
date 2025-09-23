'use client'

import TitleBar from '@components/common/title-bar'
import { ActionIcon, Container, Group, Paper, Table, Tooltip } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { MdOutlineSettings } from 'react-icons/md'
import EditModal from './edit'
import { usePermissions } from '@utils/permission'

const FiscalYearUi = ({ data }: any) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()

  const editHandler = () => {
    openModal({
      children: <EditModal formatCode={data?.data?.formatCode || ''} />,
      centered: true,
      withCloseButton: false
    })
  }

  return (
    <Container>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        <TitleBar title="Fiscal Year Setup" url="/" />
        {canUpdate ? (
          <Group gap="xs">
            <Tooltip label="Setup Fiscal Year" withArrow position="bottom">
              <ActionIcon onClick={editHandler}>
                <MdOutlineSettings />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : null}
      </Group>

      {/* Conditionally render the table only if formatCode exists */}
      {data?.data?.formatCode !== undefined && (
        <Paper shadow="xs" mb="xs">
          <Table variant="vertical" layout="fixed" withTableBorder>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={160}>Fiscal Year</Table.Th>
                <Table.Td>
                  {data.data.formatCode === 1
                    ? 'January to December'
                    : data.data.formatCode === 2
                    ? 'July to June'
                    : data.data.formatCode}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Container>
  )
}

export default FiscalYearUi
