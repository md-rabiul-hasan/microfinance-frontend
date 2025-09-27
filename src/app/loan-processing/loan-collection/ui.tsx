'use client'

import { getMemberInformation } from '@actions/common-config'
import { createDeposit, getMemberDepositList } from '@actions/deposit/regular-deposit-config'
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
  ScrollArea,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { modals, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { RegularDepositSetupValidationSchema } from '@schemas/deposit.schema'
import { formatToYMD } from '@utils/datetime.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { usePermissions } from '@utils/permission'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition } from 'react'
import { BiCategoryAlt, BiSave, BiSearch } from 'react-icons/bi'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { IoCalendarOutline } from 'react-icons/io5'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'
import EditModal from './edit'

const LoanCollectionPageUi = ({ accounts }: any) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()
  // Get transaction date from session and format it
  const initialDepositDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [isSearchLoading, startSearchTransition] = useTransition()
  const [memberId, setMemberId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberKeyCode, setMemberKeyCode] = useState(0)
  const [memberData, setMemberData] = useState<any>(null)

  const form = useForm({
    validate: yupResolver(RegularDepositSetupValidationSchema),
    initialValues: {
      member_key_code: '',
      account_code: '',
      amount: '',
      deposit_date: initialDepositDate,
      remarks: ''
    }
  })

  const handleSearchMember = () => {
    if (!memberId.trim()) {
      showNotification(getErrorMessage('Please enter a member ID'))
      return
    }

    startSearchTransition(async () => {
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
        const memberKeyCode = memberRes.data?.memberKeyCode || 0
        setMemberKeyCode(memberKeyCode)
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
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to regular deposit amount ?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          try {
            const res = await createDeposit(values)
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
    })
  }

  const editHandler = (deposit: any) =>
    openModal({
      children: (
        <EditModal
          deposit={deposit}
          accounts={accounts}
          memberId={memberId}
          memberName={memberName}
          memberKeyCode={memberKeyCode}
        />
      ),
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
                Loan Collect regular deposit amount from member
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
                    loading={isSearchLoading}
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
                  value: String(data.acc_code),
                  label: `${data.acc_name} - ${data.acc_code}`
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

              {
                canCreate ? <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                  Submit
                </Button> : null
              }

            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          {memberName && (
            <Paper shadow="xs" p="xs">
              <Title order={4} mb="md">
                Deposit History for: {memberName}
              </Title>
              <ScrollArea h={510} type="always">
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
                                {
                                  canUpdate ? <Menu.Item onClick={() => editHandler(deposit)}>Edit</Menu.Item> : null
                                }
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
              </ScrollArea>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default LoanCollectionPageUi
