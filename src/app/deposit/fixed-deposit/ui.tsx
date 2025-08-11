'use client'

import { getMemberInformation } from '@actions/common-config'
import { createFdrDeposit, getMemberFdrList } from '@actions/deposit/fixed-deposit-config'
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
  Table,
  Textarea,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { FixedDepositSetupValidationSchema } from '@schemas/deposit.schema'
import { formatToYMD } from '@utils/datetime.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition } from 'react'
import { BiSave, BiSearch } from 'react-icons/bi'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { IoCalendarOutline } from 'react-icons/io5'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'
import EditModal from './edit'

const FdrDepositPageUi = () => {
  const initialDepositDate = formatToYMD(getSessionTransactionDate());
  const [isLoading, startTransition] = useTransition()
  const [isSearchLoading, startSearchTransition] = useTransition()
  const [memberId, setMemberId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberKeyCode, setMemberKeyCode] = useState(0)
  const [memberData, setMemberData] = useState<any>(null)

  const form = useForm({
    validate: yupResolver(FixedDepositSetupValidationSchema),
    initialValues: {
      member_key_code: '',
      fdr_length: '',
      amount: '',
      opening_date: initialDepositDate,
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
        const depositRes = await getMemberFdrList(memberKeyCode)
        console.log('Deposit History:', depositRes)

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
        const res = await createFdrDeposit(values)
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
      children: <EditModal deposit={deposit} memberId={memberId} memberName={memberName} memberKeyCode={memberKeyCode} />,
      centered: true,
      withCloseButton: false
    })

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Member Deposit || Fixed Deposit" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submitHandler)}>
              <Title order={4} mb="md">
                Collect Fixed deposit amount from member
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

              <NumberInput
                label="Deposit Amount (BDT)"
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
                label="Opening Date"
                mb="xs"
                {...form.getInputProps('opening_date')}
                withAsterisk
                leftSection={<IoCalendarOutline />}
              />

              <NumberInput
                label="Deposit Length (in Month)"
                decimalScale={0}
                fixedDecimalScale
                hideControls
                mb="xs"
                withAsterisk
                {...form.getInputProps('fdr_length')}
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
                Fixed Deposit History for: {memberName}
              </Title>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Open Date</Table.Th>
                    <Table.Th>Close Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Tenure</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {memberData?.length > 0 ? (
                    memberData.map((deposit: any) => (
                      <Table.Tr key={deposit.keyCode}>
                        <Table.Td>Fixed Deposit</Table.Td>
                        <Table.Td>
                          {deposit.open_date}
                        </Table.Td>
                        <Table.Td>
                          {deposit.close_date}
                        </Table.Td>
                        <Table.Td>৳ {deposit.amount}</Table.Td>
                        <Table.Td>{deposit.period_in_month} Months</Table.Td>
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
                      <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
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

export default FdrDepositPageUi
