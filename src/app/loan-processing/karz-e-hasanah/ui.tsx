'use client'

import { getMemberInformation } from '@actions/common-config'
import { createWithdrawal, getMemberWithdrawList } from '@actions/withdrawal/withdrawal-amount-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Menu,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { bankAccountValidationSchema } from '@schemas/settings.schema'
import { formatToYMD } from '@utils/datetime.util'
import { formatAsTaka } from '@utils/format.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition } from 'react'
import { BiCategoryAlt, BiIdCard, BiSave, BiSearch } from 'react-icons/bi'
import { FaRegClock } from "react-icons/fa"
import { GrNotes } from "react-icons/gr"
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { IoCalendarOutline } from "react-icons/io5"
import { MdOutlineGrid3X3 } from "react-icons/md"
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from "react-icons/tb"
import EditModal from './edit'

const KarzEHasanahPageUi = ({ accounts, approvars }: any) => {
  const initialDate = formatToYMD(getSessionTransactionDate());
  const [isLoading, startTransition] = useTransition()
  const [isSearchLoading, startSearchTransition] = useTransition()
  const [memberId, setMemberId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberKeyCode, setMemberKeyCode] = useState(0)
  const [memberData, setMemberData] = useState<any>(null)
  const [accountBalance, setAccountBalance] = useState<number | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [memberInfo, setMemberInfo] = useState<any>(null)

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(bankAccountValidationSchema),
    initialValues: {
      member_key_code: '',
      account_code: '',
      available_balance: '',
      amount: '',
      loan_date: initialDate,
      remarks: '',
      loan_id: '',
      loan_amount: '',
      profit_amount: 0,
      total_loan_amount: '',
      service_charge: '',
      application_fees: '',
      revenue_charge: '',
      payment_frequency: '',
      loan_tenure: '',
      payment_completion_date: '',
      installment_amount: '',
      approved_by: '',
      risk_amt_share: '',
      risk_amt_deposit: '',
      risk_amt_gr_1: '',
      memberId_gr_1: '',
      risk_amt_gr_2: '',
      memberId_gr_2: '',
      risk_amt_gr_3: '',
      memberId_gr_3: '',
      risk_amt_authority: '',
      remarks: '',
    }
  })

  const handleAccountSelect = (accountCode: string) => {
    // Implement your account selection logic here
    console.log('Selected account:', accountCode)
  }

  const handleSearchMember = () => {
    if (!memberId.trim()) {
      showNotification(getErrorMessage('Please enter a member ID'))
      return
    }

    startSearchTransition(async () => {
      try {
        const memberRes = await getMemberInformation(memberId)

        if (!memberRes.success) {
          showNotification(getErrorMessage(memberRes?.message))
          setMemberName('')
          setMemberData(null)
          return
        }

        setMemberName(memberRes.data?.name)
        setMemberInfo(memberRes.data)
        const memberKeyCode = memberRes.data?.memberKeyCode || 0
        setMemberKeyCode(memberKeyCode)

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
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchMember()
    }
  }

  const submitHandler = (values: any) => {
    if (!accountBalance || parseFloat(values.amount) > accountBalance) {
      showNotification(getErrorMessage('Withdrawal amount cannot exceed available balance'))
      return
    }

    startTransition(async () => {
      try {
        const res = await createWithdrawal(values)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message))
          handleSearchMember()
          reset()
          setAccountBalance(null)
        } else {
          showNotification(getErrorMessage(res?.message))
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to create withdrawal'))
      }
    })
  }

  const editHandler = (deposit: any) =>
    openModal({
      children: <EditModal deposit={deposit} accounts={accounts} memberId={memberId} memberName={memberName} memberKeyCode={memberKeyCode} />,
      centered: true,
      withCloseButton: false
    })


  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Islamic Investment | Karz-E-Hasanah" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <form onSubmit={onSubmit(submitHandler)}>
            <Paper shadow="xs" p="xs" className="responsive-form">
              <Title order={4} mb="md">
                Islamic Investment | Karz-e-Hasanah
              </Title>

              {/* Member ID Search */}
              <Paper shadow="xs" p="xs" mt="xs">
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 8, md: 4 }}>
                    <TextInput
                      label="Member ID"
                      mb="xs"
                      withAsterisk
                      value={memberId}
                      onChange={(e) => setMemberId(e.currentTarget.value)}
                      onKeyDown={handleKeyPress}
                      leftSection={<BiIdCard />}
                      placeholder="Enter member ID"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 4, md: 2 }}>
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
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Member Name"
                      value={memberName}
                      disabled
                      mb="xs"
                      withAsterisk
                      leftSection={<RiUser3Line />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Loan Details */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Loan ID"
                      {...getInputProps('loan_id')}
                      disabled
                      mb="xs"
                      withAsterisk
                      leftSection={<MdOutlineGrid3X3 />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Loan Amount"
                      {...getInputProps('loan_amount')}
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Profit Amount"
                      {...getInputProps('profit_amount')}
                      mb="xs"
                      withAsterisk
                      disabled
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Total Loan"
                      {...getInputProps('total_loan_amount')}
                      mb="xs"
                      disabled
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Loan Type & Charges */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Loan Type"
                      placeholder="Please Select"
                      data={accounts.map((data: any) => ({
                        value: String(data.acc_code),
                        label: `${data.acc_name} - ${data.acc_code}`
                      }))}
                      searchable
                      withAsterisk
                      mb="xs"
                      leftSection={<BiCategoryAlt />}
                      {...getInputProps('account_code')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Service Charge"
                      {...getInputProps('service_charge')}
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Application Fees"
                      {...getInputProps('application_fees')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Revenue Charge"
                      {...getInputProps('revenue_charge')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Payment & Tenure */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Payment Frequency"
                      placeholder="Please Select"
                      data={[
                        { value: 'W', label: 'Weekly (Shaptahik)' },
                        { value: 'M', label: 'Monthly (Mashik)' }
                      ]}
                      searchable
                      withAsterisk
                      mb="xs"
                      leftSection={<BiCategoryAlt />}
                      {...getInputProps('payment_frequency')}  // Make sure this matches your form field name
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Loan Tenure"
                      {...getInputProps('loan_tenure')}
                      mb="xs"
                      withAsterisk
                      leftSection={<FaRegClock />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      type="date"
                      label="Loan Date"
                      {...getInputProps('loan_date')}
                      mb="xs"
                      withAsterisk
                      leftSection={<IoCalendarOutline />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      type='date'
                      label="Payment Completion Date"
                      {...getInputProps('payment_completion_date')}
                      disabled
                      mb="xs"
                      withAsterisk
                      leftSection={<IoCalendarOutline />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Installment & Approval */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Installment Amount"
                      {...getInputProps('installment_amount')}
                      mb="xs"
                      disabled
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Loan Approved By"
                      placeholder="Please Select"
                      data={approvars.map((data: any) => ({
                        value: String(data.keyCode),
                        label: `${data.commName}`
                      }))}
                      searchable
                      withAsterisk
                      mb="xs"
                      leftSection={<BiCategoryAlt />}
                      {...getInputProps('approved_by')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Risk Coverage Section */}
              <Paper shadow="xs" p="xs" mt="xs">
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Risk Amount Cover By Share"
                      {...getInputProps('risk_amt_share')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Risk Amount Cover By Deposit"
                      {...getInputProps('risk_amt_deposit')}
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Risk Covered By 1st Guarantor"
                      {...getInputProps('risk_amt_gr_1')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Member ID of 1st Guarantor"
                      {...getInputProps('memberId_gr_1')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                </Grid>

                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Risk Covered By 2nd Guarantor"
                      {...getInputProps('risk_amt_gr_2')}
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Member ID of 2nd Guarantor"
                      {...getInputProps('memberId_gr_2')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Risk Covered By 3rd Guarantor"
                      {...getInputProps('risk_amt_gr_3')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Member ID of 3rd Guarantor"
                      {...getInputProps('memberId_gr_3')}
                      mb="xs"
                      withAsterisk
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                </Grid>

                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 6 }}>
                    <TextInput
                      label="Risk Amount Covered By Approval Authority"
                      {...getInputProps('risk_amt_authority')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Disbursement Note/Remarks"
                      {...getInputProps('remarks')}
                      readOnly
                      mb="xs"
                      withAsterisk
                      leftSection={<GrNotes />}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              <Button mt="xs" type="submit" leftSection={<BiSave />} loading={isLoading}>
                Submit
              </Button>
            </Paper>
          </form>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>

          {
            memberInfo?.profile_image?.insert_key || memberInfo?.signature_image?.insert_key ? (
              <Box mb="xs">
                <Title order={4}>
                  Visual Identification
                </Title>

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
            ) : null
          }
          {memberName && (
            <Paper shadow="xs" p="xs">
              <Title order={6} mb="xs">
                Earlier Loan Disbursement for: {memberName}
              </Title>
              <Divider variant="dashed" mb="xs" />
              <ScrollArea h={325} type="always">
                <Table striped highlightOnHover verticalSpacing={2} horizontalSpacing={2} style={{ fontSize: '10px' }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Account</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Charge</Table.Th>
                      <Table.Th>Tenure</Table.Th>
                      <Table.Th>Approved</Table.Th>
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
                          <Table.Td>{formatAsTaka(deposit.amt)}</Table.Td>
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
              </ScrollArea>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Container >
  )
}

export default KarzEHasanahPageUi