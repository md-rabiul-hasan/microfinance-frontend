'use client'

import TitleBar from '@components/common/title-bar'
import { ActionIcon, Container, Group, Paper, Table, Tooltip } from '@mantine/core'
import { MdOutlineSettings } from "react-icons/md"
// Define the props type

const CompanyInfoUi = ({ data }: any) => {

  return (
    <Container>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        < TitleBar title="Company Setup" url="/" />
        <Group gap="xs">
          <Tooltip label="Setup Company" withArrow position="bottom">
            <ActionIcon >
              <MdOutlineSettings />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group >

      {/* Product Table */}
      <Paper shadow="xs" mb="xs" >
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
          </Table.Tbody>
        </Table>
      </Paper >
    </Container >
  )
}

export default CompanyInfoUi
