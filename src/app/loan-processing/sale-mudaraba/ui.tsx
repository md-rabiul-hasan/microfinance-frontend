'use client'

import { getMemberInformation } from '@actions/common-config'
import { getMemberLoanList } from '@actions/loan-processing/karz-e-hasanah-config'
import { createSaleMurabaha } from '@actions/loan-processing/sale-murabaha-config'
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
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { modals, openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { saleMurabahaValidationSchema } from '@schemas/loan-processing.schema'
import { formatToYMD } from '@utils/datetime.util'
import { formatAsTaka } from '@utils/format.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { generate7DigitId } from '@utils/utils'
import { useEffect, useState, useTransition } from 'react'
import { BiCategoryAlt, BiIdCard, BiSave, BiSearch } from 'react-icons/bi'
import { FaRegClock } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import { GrNotes } from 'react-icons/gr'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdOutlineGrid3X3 } from 'react-icons/md'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka, TbListDetails } from 'react-icons/tb'
import EditModal from './edit'
import ProductListModal from './product'

const SaleMudarabaPageUi = ({ accounts, approvars }: any) => {
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
  // Add this to your parent component's state
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const form = useForm({
    validate: yupResolver(saleMurabahaValidationSchema),
    initialValues: {
      product_id: '',
      product_details: '',
      purchase_date: '',
      product_price: '',
      profit_amount: '',
      total_selling_price: 0,
      account_code: '',
      loan_date: initialDate,
      remarks: '',
      loan_id: generate7DigitId(),
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
      risk_amt_authority: ''
    }
  })

  const { onSubmit, getInputProps, values, reset, setValues, setFieldValue } = form

  // Calculate total loan amount when loan_amount or profit_amount changes
  useEffect(() => {
    const product_price = Number(values.product_price) || 0
    const profitAmount = Number(values.profit_amount) || 0
    const total = product_price + profitAmount

    // Only update if the value actually changed
    if (Number(values.total_selling_price) !== total) {
      setFieldValue('total_selling_price', total)
    }
  }, [values.profit_amount])

  // Calculate completion date and installment when frequency, tenure or loan date changes
  useEffect(() => {
    if (values.payment_frequency && values.loan_tenure && values.loan_date) {
      const totalLoan = Number(values.total_selling_price) || 0
      const tenure = Number(values.loan_tenure) || 0
      const frequency = values.payment_frequency as 'W' | 'M'

      // Calculate completion date
      const date = new Date(values.loan_date)
      if (frequency === 'W') {
        date.setDate(date.getDate() + tenure * 7)
      } if (frequency === 'F') {
        date.setDate(date.getDate() + tenure * 15)
      } else {
        date.setMonth(date.getMonth() + tenure)
      }
      const completionDate = formatToYMD(date)

      // Calculate installment amount
      const installment = tenure > 0 ? totalLoan / tenure : 0

      // Batch updates to prevent multiple renders
      setValues({
        ...values,
        payment_completion_date: completionDate,
        installment_amount: installment.toFixed(2)
      })
    }
  }, [values.payment_frequency, values.loan_tenure, values.loan_date])

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

        const loanRes = await getMemberLoanList(memberKeyCode)

        if (loanRes.success) {
          setMemberData(loanRes.data)
        } else {
          showNotification(getErrorMessage(loanRes?.message))
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
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to process this sale murabaha?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          try {
            const formData = {
              ...values,
              member_key_code: memberKeyCode
            }
            const res = await createSaleMurabaha(formData)
            if (res.success) {
              showNotification(getSuccessMessage(res?.message))
              handleSearchMember()
              reset()
              setAccountBalance(null)
            } else {
              showNotification(getErrorMessage(res?.message))
            }
          } catch (error) {
            showNotification(getErrorMessage('Failed to create loan'))
          }
        })
      }
    })
  }

  const editHandler = (loan: any) =>
    openModal({
      children: (
        <EditModal loan={loan} accounts={accounts} approvars={approvars} memberId={memberId} memberName={memberName} />
      ),
      centered: true,
      withCloseButton: false,
      size: 'xl'
    })

  const sellableProductList = () => {
    openModal({
      title: 'Select Product',
      size: 'xl',
      children: (
        <ProductListModal
          onSelect={(product: any) => {
            setFieldValue('product_id', product.product_uniq_id)
            setFieldValue('product_details', product.item_details)
            setFieldValue('purchase_date', product.purchase_date)
            setFieldValue('product_price', product.purchase_cost)
            setFieldValue('total_selling_price', product.purchase_cost)
          }}
          onClose={() => modals.closeAll()}
        />
      )
    })
  }

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Islamic Investment | Murabaha ( Sale product item based on Murabaha )" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <form onSubmit={onSubmit(submitHandler)}>
            <div shadow="xs" p="xs" className="responsive-form">
              <Paper shadow="xs" p="xs" mt="xs">
                {/* Loan Details */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Product ID"
                      {...getInputProps('product_id')}
                      disabled
                      mb="xs"
                      withAsterisk
                      leftSection={<MdOutlineGrid3X3 />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 4, md: 1 }}>
                    <Button
                      mb="xs"
                      px={0}
                      fullWidth
                      style={{ height: '36px' }}
                      title="Search Product"
                      onClick={sellableProductList}
                    >
                      <FaPlus size={18} />
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 8 }}>
                    <TextInput
                      label="Product Details"
                      {...getInputProps('product_details')}
                      mb="xs"
                      disabled
                      withAsterisk
                      leftSection={<TbListDetails />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Loan Type & Charges */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      type="date"
                      label="Purchase Date"
                      {...getInputProps('purchase_date')}
                      mb="xs"
                      disabled
                      leftSection={<IoCalendarOutline />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Product Price (BDT)"
                      {...getInputProps('product_price')}
                      mb="xs"
                      disabled
                      hideControls
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <NumberInput
                      label="Profit Amount (BDT)"
                      {...getInputProps('profit_amount')}
                      mb="xs"
                      hideControls
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Total Selling Price (BDT)"
                      {...getInputProps('total_selling_price')}
                      mb="xs"
                      leftSection={<TbCoinTaka />}
                      disabled
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

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
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Payment Frequency"
                      placeholder="Please Select"
                      data={[
                        { value: 'W', label: 'Weekly (Shaptahik)' },
                        { value: 'F', label: 'Fortnightly (Pakkhik)' },
                        { value: 'M', label: 'Monthly (Mashik)' }
                      ]}
                      searchable
                      withAsterisk
                      mb="xs"
                      leftSection={<BiCategoryAlt />}
                      {...getInputProps('payment_frequency')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Loan Tenure"
                      {...getInputProps('loan_tenure')}
                      mb="xs"
                      withAsterisk
                      hideControls
                      leftSection={<FaRegClock />}
                    />
                  </Grid.Col>
                </Grid>

                {/* Loan Type & Charges */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      type="date"
                      label="Sale Date"
                      {...getInputProps('loan_date')}
                      mb="xs"
                      withAsterisk
                      leftSection={<IoCalendarOutline />}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      type="date"
                      label="Payment Completion Date"
                      {...getInputProps('payment_completion_date')}
                      disabled
                      mb="xs"
                      withAsterisk
                      leftSection={<IoCalendarOutline />}
                    />
                  </Grid.Col>
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

                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Application Fees"
                      {...getInputProps('application_fees')}
                      mb="xs"
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                </Grid>
                {/* Installment & Approval */}
                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <TextInput
                      label="Revenue Charge"
                      {...getInputProps('revenue_charge')}
                      mb="xs"
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
                    <NumberInput
                      label="Risk Amount Cover By Share"
                      {...getInputProps('risk_amt_share')}
                      mb="xs"
                      hideControls
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Risk Amount Cover By Deposit"
                      {...getInputProps('risk_amt_deposit')}
                      mb="xs"
                      hideControls
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Risk Covered By 1st Guarantor"
                      {...getInputProps('risk_amt_gr_1')}
                      hideControls
                      mb="xs"
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Member ID of 1st Guarantor"
                      {...getInputProps('memberId_gr_1')}
                      hideControls
                      mb="xs"
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                </Grid>

                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Risk Covered By 2nd Guarantor"
                      {...getInputProps('risk_amt_gr_2')}
                      mb="xs"
                      hideControls
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Member ID of 2nd Guarantor"
                      {...getInputProps('memberId_gr_2')}
                      hideControls
                      mb="xs"
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Risk Covered By 3rd Guarantor"
                      {...getInputProps('risk_amt_gr_3')}
                      hideControls
                      mb="xs"
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, md: 3 }}>
                    <NumberInput
                      label="Member ID of 3rd Guarantor"
                      {...getInputProps('memberId_gr_3')}
                      mb="xs"
                      hideControls
                      leftSection={<BiIdCard />}
                    />
                  </Grid.Col>
                </Grid>

                <Grid gutter="xs" align="flex-end">
                  <Grid.Col span={{ base: 6, md: 6 }}>
                    <NumberInput
                      label="Risk Amount Covered By Approval Authority"
                      {...getInputProps('risk_amt_authority')}
                      hideControls
                      mb="xs"
                      leftSection={<TbCoinTaka />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Disbursement Note/Remarks"
                      {...getInputProps('remarks')}
                      withAsterisk
                      mb="xs"
                      leftSection={<GrNotes />}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              <Button mt="xs" type="submit" leftSection={<BiSave />} loading={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
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
                      memberData.map((loan: any) => (
                        <Table.Tr key={loan.disburseID}>
                          <Table.Td>{loan.disburseDate}</Table.Td>
                          <Table.Td>{loan.account_info?.acc_name}</Table.Td>
                          <Table.Td>{formatAsTaka(loan.LnAmount)}</Table.Td>
                          <Table.Td>{formatAsTaka(loan.sCharge)}</Table.Td>
                          <Table.Td>
                            {loan.tenure} {loan.pay_frequency == 'M' ? 'Months' : 'Weeks'}
                          </Table.Td>
                          <Table.Td>{loan.approvar?.commName}</Table.Td>
                          <Table.Td>
                            <Menu withArrow>
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <MoreIcon />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item onClick={() => editHandler(loan)}>Edit</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                          {memberData ? 'No loan history found' : 'Search for a member to view loan history'}
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

export default SaleMudarabaPageUi
