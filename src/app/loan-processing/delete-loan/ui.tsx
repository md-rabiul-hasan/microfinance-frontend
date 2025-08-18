'use client'

import { getMemberInformation } from '@actions/common-config'
import { getMemberLoanListForDelete } from '@actions/loan-processing/delete-loan-config'
import {
  getAccountBalance
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
  Menu,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { formatToYMD } from '@utils/datetime.util'
import { formatAsTaka } from '@utils/format.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition } from 'react'
import { BiSearch } from 'react-icons/bi'
import { IoSearchSharp } from "react-icons/io5"
import { RiUser3Line } from 'react-icons/ri'

import { getLoanType } from '@utils/utils'
import { IoIosMore as MoreIcon } from 'react-icons/io'
const DeleteLoanPageUi = ({ accounts }: any) => {
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
    initialValues: {
      member_key_code: '',
      account_code: '',
      available_balance: '',
      amount: '',
      withdraw_date: initialDate,
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
          setAccountBalance(null)
          return
        }

        // Set member info in form and state
        setMemberName(memberRes.data?.name)
        setMemberInfo(memberRes.data)
        const memberKeyCode = memberRes.data?.memberKeyCode || 0
        setMemberKeyCode(memberKeyCode)
        form.setFieldValue('member_key_code', memberKeyCode)
      } catch (error) {
        showNotification(getErrorMessage('Failed to fetch member information'))
        setMemberName('')
        setMemberData(null)
        setAccountBalance(null)
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

  const submitHandler = () => {
    startTransition(async () => {
      try {
        const res = await getMemberLoanListForDelete(memberKeyCode)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message))
          setMemberData(res.data)
        } else {
          showNotification(getErrorMessage(res?.message))
        }
      } catch (error) {
        console.log('error', error)

        showNotification(getErrorMessage('Failed to create withdrawal'))
      }
    })
  }



  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Loan Admin || Delete Loan" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submitHandler)}>
              <Title order={4} mb="md">
                Delete Loan Options
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
              <Button type="submit" leftSection={<IoSearchSharp />} loading={isLoading}>
                Search Loan Info
              </Button>
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
        </Grid.Col>

        {memberData && (
          <Grid.Col span={{ base: 12, md: 12 }}>

            <Paper shadow="xs" p="xs">
              <Title order={4} mb="md">
                Loan History for: {memberName}
              </Title>
              <ScrollArea h={325} type="always">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SL</Table.Th>
                      <Table.Th>Loan ID</Table.Th>
                      <Table.Th>Loan Type</Table.Th>
                      <Table.Th>Loan Account</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Disburse Date</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {memberData?.length > 0 ? (
                      memberData.map((deposit: any, index: any) => (
                        <Table.Tr key={deposit.tr_sl}>
                          <Table.Td>{++index}</Table.Td>
                          <Table.Td>{deposit.loan_id}</Table.Td>
                          <Table.Td>{getLoanType(deposit.sales_type)}</Table.Td>
                          <Table.Td>
                            {deposit.account_info?.acc_name} ({deposit.account_info?.acc_code})
                          </Table.Td>
                          <Table.Td>{formatAsTaka(deposit.LnAmount)}</Table.Td>
                          <Table.Td>{deposit.disburseDate}</Table.Td>
                          <Table.Td>
                            <Menu withArrow>
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <MoreIcon />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item onClick={() => editHandler(deposit)}>Delete</Menu.Item>
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

          </Grid.Col>
        )}
      </Grid>
    </Container>
  )
}

export default DeleteLoanPageUi
