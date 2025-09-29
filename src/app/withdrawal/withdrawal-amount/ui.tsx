'use client'

import { getMemberInformation } from '@actions/common-config'
import {
  createWithdrawal,
  getAccountBalance,
  getMemberWithdrawList
} from '@actions/withdrawal/withdrawal-amount-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
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
import { WithdrawalAmountSetupValidationSchema } from '@schemas/withdrawal.schema'
import { formatToYMD } from '@utils/datetime.util'
import { formatAsTaka } from '@utils/format.util'
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

const WithdrawalPageUi = ({ accounts }: any) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [isSearchLoading, startSearchTransition] = useTransition()
  const [memberId, setMemberId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberKeyCode, setMemberKeyCode] = useState(0)
  const [memberData, setMemberData] = useState<any>(null)
  const [accountBalance, setAccountBalance] = useState<number | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [memberInfo, setMemberInfo] = useState<any>(null)

  const form = useForm({
    validate: yupResolver(WithdrawalAmountSetupValidationSchema),
    initialValues: {
      member_key_code: '',
      account_code: '',
      available_balance: '',
      amount: '',
      withdraw_date: initialDate,
      remarks: ''
    }
  })

  // Function to refresh member data
  const refreshMemberData = async () => {
    if (!memberKeyCode) return

    try {
      const depositRes = await getMemberWithdrawList(memberKeyCode)
      if (depositRes.success) {
        setMemberData(depositRes.data)
      }
    } catch (error) {
      console.error('Failed to refresh member data:', error)
    }
  }

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
          setAccountBalance(null)
          setMemberInfo(null)
          return
        }

        // Set member info in form and state
        setMemberName(memberRes.data?.name)
        setMemberInfo(memberRes.data)
        const memberKeyCode = memberRes.data?.memberKeyCode || 0
        setMemberKeyCode(memberKeyCode)
        form.setFieldValue('member_key_code', memberKeyCode)

        // Then get withdrawal history
        const depositRes = await getMemberWithdrawList(memberKeyCode)

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
        setAccountBalance(null)
        setMemberInfo(null)
      }
    })
  }

  const handleAccountSelect = async (accountCode: string) => {
    if (!memberKeyCode) {
      showNotification(getErrorMessage('Please select a member first'))
      return
    }

    setIsBalanceLoading(true)
    try {
      const res = await getAccountBalance(memberKeyCode, accountCode)
      if (res.success) {
        setAccountBalance(res.data.balance)
        form.setFieldValue('available_balance', res.data.balance)
      } else {
        showNotification(getErrorMessage(res?.message))
        setAccountBalance(null)
        form.setFieldValue('available_balance', '')
      }
    } catch (error) {
      showNotification(getErrorMessage('Failed to fetch account balance'))
      setAccountBalance(null)
      form.setFieldValue('available_balance', '')
    } finally {
      setIsBalanceLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchMember()
    }
  }

  const submitHandler = (values: typeof form.values) => {
    if (!accountBalance || parseFloat(values.amount) > accountBalance) {
      showNotification(getErrorMessage('Withdrawal amount cannot exceed available balance'))
      return
    }

    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to process this member amount withdraw?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          try {
            const res = await createWithdrawal(values)
            if (res.success) {
              showNotification(getSuccessMessage(res?.message))
              // Refresh member data after successful withdrawal
              await refreshMemberData()
              form.reset()
              form.setFieldValue('withdraw_date', initialDate)
              setAccountBalance(null)
            } else {
              showNotification(getErrorMessage(res?.message))
            }
          } catch (error) {
            showNotification(getErrorMessage('Failed to create withdrawal'))
          }
        })
      }
    })
  }

  const editHandler = (withdrawal: any) =>
    openModal({
      children: (
        <EditModal
          withdrawal={withdrawal}
          accounts={accounts}
          memberId={memberId}
          memberName={memberName}
          memberKeyCode={memberKeyCode}
          onSuccess={refreshMemberData} // Pass refresh function as prop
        />
      ),
      centered: true,
      withCloseButton: false
    })

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Withdrawal Amount" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submitHandler)}>
              <Title order={4} mb="md">
                Amount withdrawal by member
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
                label="Withdrawal From"
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
                onChange={(value) => {
                  form.getInputProps('account_code').onChange(value)
                  if (value) handleAccountSelect(value)
                }}
              />

              <NumberInput
                label="Available Balance"
                decimalScale={2}
                fixedDecimalScale
                disabled
                hideControls
                mb="xs"
                withAsterisk
                leftSection={isBalanceLoading ? <Loader size="xs" /> : <TbCoinTaka />}
                value={formatAsTaka(accountBalance || 0)}
              />

              <NumberInput
                label="Withdrawal Amount (BDT)"
                decimalScale={2}
                fixedDecimalScale
                hideControls
                mb="xs"
                withAsterisk
                {...form.getInputProps('amount')}
                leftSection={<TbCoinTaka />}
              />

              <TextInput
                type="date"
                label="Withdrawal Date"
                mb="xs"
                {...form.getInputProps('withdraw_date')}
                withAsterisk
                leftSection={<IoCalendarOutline />}
              />

              <Textarea label="Remarks" {...form.getInputProps('remarks')} withAsterisk mb="xs" />

              {canCreate ? (
                <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                  Submit
                </Button>
              ) : null}
            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          {memberInfo?.profile_image?.insert_key || memberInfo?.signature_image?.insert_key ? (
            <Box mb="xs">
              <Title order={4}>Visual Identification</Title>

              <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                {/* Profile Image */}
                <Box style={{ flex: 1 }} pos="relative">
                  <Box
                    mt="sm"
                    style={{
                      border: '1px dashed #ddd',
                      borderRadius: 'var(--mantine-radius-sm)',
                      padding: '0.5rem',
                      minHeight: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {memberInfo?.profile_image?.insert_key ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_API_FILE_URL}/member_uploads/profile_picture/${memberInfo.profile_image.insert_key}`}
                        alt="Profile preview"
                        height={180}
                        fit="contain"
                        style={{ maxWidth: '100%' }}
                      />
                    ) : (
                      <Text color="dimmed" size="sm">
                        No profile image available
                      </Text>
                    )}
                  </Box>
                </Box>

                {/* Signature Image */}
                <Box style={{ flex: 1 }} pos="relative">
                  <Box
                    mt="sm"
                    style={{
                      border: '1px dashed #ddd',
                      borderRadius: 'var(--mantine-radius-sm)',
                      padding: '0.5rem',
                      minHeight: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {memberInfo?.signature_image?.insert_key ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_API_FILE_URL}/member_uploads/signature_card/${memberInfo.signature_image.insert_key}`}
                        alt="Signature preview"
                        height={180}
                        fit="contain"
                        style={{ maxWidth: '100%' }}
                      />
                    ) : (
                      <Text color="dimmed" size="sm">
                        No signature image available
                      </Text>
                    )}
                  </Box>
                </Box>
              </Flex>
            </Box>
          ) : null}
          {memberName && (
            <Paper shadow="xs" p="xs">
              <Title order={4} mb="md">
                Withdrawal History for: {memberName}
              </Title>
              <ScrollArea h={325} type="always">
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
                      memberData.map((withdrawal: any) => (
                        <Table.Tr key={withdrawal.tr_sl}>
                          <Table.Td>{withdrawal.trDate}</Table.Td>
                          <Table.Td>
                            {withdrawal.account_info?.AccountDisplayName} ({withdrawal.account_info?.accountCode})
                          </Table.Td>
                          <Table.Td>{formatAsTaka(withdrawal.amt)}</Table.Td>
                          <Table.Td>
                            <Menu withArrow>
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <MoreIcon />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {canUpdate ? <Menu.Item onClick={() => editHandler(withdrawal)}>Edit</Menu.Item> : null}
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                          {memberData
                            ? 'No withdrawal history found'
                            : 'Search for a member to view withdrawal history'}
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

export default WithdrawalPageUi
