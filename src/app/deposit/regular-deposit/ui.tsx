'use client'

import { createRegularDeposit, getMemberDepositList } from '@actions/deposit/regular-deposit-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Group,
  Menu,
  NumberInput,
  Paper,
  Select,
  Table,
  Textarea,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition, useState } from 'react'
import { BiCategoryAlt, BiSave, BiSearch } from 'react-icons/bi'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'
import { IoCalendarOutline } from 'react-icons/io5'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { getMemberInformation } from '@actions/common-config'
import { RegularDepositSetupValidationSchema } from '@schemas/deposit.schema'
import EditModal from './edit'

const RegularDepositPageUi = ({ accounts }: any) => {
  const [isLoading, startTransition] = useTransition()
  const [memberId, setMemberId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberData, setMemberData] = useState<any>(null)

  const form = useForm({
    validate: yupResolver(RegularDepositSetupValidationSchema),
    initialValues: {
      member_key_code: '',
      account_code: '',
      amount: '',
      deposit_date: '',
      remarks: ''
    }
  })

  const handleSearchMember = () => {
    if (!memberId.trim()) {
      showNotification(getErrorMessage('Please enter a member ID'))
      return
    }

    startTransition(async () => {
      try {
        // First get member information
        const memberRes = await getMemberInformation(memberId)

        if (!memberRes.success) {
          showNotification(getErrorMessage(memberRes?.message))
          setMemberName('')
          setMemberData(null)
          return
        }

        // Set member info in form and state
        setMemberName(memberRes.data?.name)
        const memberKeyCode = memberRes.data?.memberKeyCode || memberId
        form.setFieldValue('member_key_code', memberKeyCode)

        // Then get deposit history
        const depositRes = await getMemberDepositList(memberKeyCode)

        if (depositRes.success) {
          setMemberData(depositRes.data)
        } else {
          showNotification(getErrorMessage(depositRes?.message))
          setMemberData(null)
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to fetch member information'))
        setMemberName('')
        setMemberData(null)
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchMember()
    }
  }

  const submitHandler = (values: typeof form.values) => {
    startTransition(async () => {
      try {
        const res = await createRegularDeposit(values)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message))
          // Refresh member data after successful deposit
          handleSearchMember()
          form.reset()
        } else {
          showNotification(getErrorMessage(res?.message))
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to create deposit'))
      }
    })
  }

  const editHandler = (deposit: any) =>
    openModal({
      children: <EditModal deposit={deposit} accounts={accounts} memberId={memberId} memberName={memberName} />,
      centered: true,
      withCloseButton: false
    })

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Member Deposit || Regular Deposit Item" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submitHandler)}>
              <Title order={4} mb="md">
                Collect deposit amount from member
              </Title>

              {/* Member ID Search */}
              <Grid gutter="xs" align="flex-end">
                <Grid.Col span={10}>
                  <TextInput
                    label="Member ID"
                    mb="xs"
                    withAsterisk
                    value={memberId}
                    onChange={(e) => setMemberId(e.currentTarget.value)}
                    onKeyDown={handleKeyPress}
                    leftSection={<RiUser3Line />}
                    placeholder="Enter member ID"
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    onClick={handleSearchMember}
                    mb="xs"
                    px={0}
                    loading={isLoading}
                    fullWidth
                    style={{ height: '36px' }}
                    title="Search member"
                  >
                    <BiSearch size={18} />
                  </Button>
                </Grid.Col>
              </Grid>

              <TextInput
                label="Member Name"
                value={memberName}
                readOnly
                mb="xs"
                withAsterisk
                leftSection={<RiUser3Line />}
              />

              <Select
                label="Deposit Against"
                placeholder="Please Select"
                data={accounts.map((data: any) => ({
                  value: String(data.accountCode),
                  label: `${data.AccountDisplayName} - ${data.accountCode}`
                }))}
                searchable
                withAsterisk
                mb="xs"
                leftSection={<BiCategoryAlt />}
                {...form.getInputProps('account_code')}
              />

              <NumberInput
                label="Deposit Amount"
                decimalScale={2}
                fixedDecimalScale
                mb="xs"
                withAsterisk
                {...form.getInputProps('amount')}
                leftSection={<TbCoinTaka />}
              />

              <TextInput
                type="date"
                label="Deposit Date"
                mb="xs"
                {...form.getInputProps('deposit_date')}
                withAsterisk
                leftSection={<IoCalendarOutline />}
              />

              <Textarea label="Remarks" {...form.getInputProps('remarks')} withAsterisk mb="xs" />

              <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                Submit
              </Button>
            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          {memberName && (
            <Paper shadow="xs" p="xs">
              <Title order={4} mb="md">
                Deposit History for: {memberName}
              </Title>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {memberData?.length > 0 ? (
                    memberData.map((deposit: any) => (
                      <Table.Tr key={deposit.tr_sl}>
                        <Table.Td>{deposit.trDate}</Table.Td>
                        <Table.Td>
                          {deposit.account_info?.AccountDisplayName} ({deposit.account_info?.accountCode})
                        </Table.Td>
                        <Table.Td>৳ {deposit.amt}</Table.Td>
                        <Table.Td>
                          <Menu withArrow>
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <MoreIcon />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item onClick={() => editHandler(deposit)}>Edit</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                        {memberData ? 'No deposit history found' : 'Search for a member to view deposit history'}
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default RegularDepositPageUi
