import { updateKarzEHasanahLoan } from '@actions/loan-processing/karz-e-hasanah-config'
import {
  Button,
  Grid,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals, modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { formatToYMD } from '@utils/datetime.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useEffect, useTransition } from 'react'
import { BiCategoryAlt, BiIdCard, BiSave } from 'react-icons/bi'
import { FaRegClock } from 'react-icons/fa'
import { GrNotes } from 'react-icons/gr'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdOutlineGrid3X3 } from 'react-icons/md'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'

interface EditModalProps {
  loan: any
  accounts: any[]
  approvars: any[]
  memberId: string
  memberName: string
  onSuccess: () => void // Add this prop to handle success callback
}

const EditModal = ({ loan, accounts, approvars, memberId, memberName, onSuccess }: any) => {
  const [isLoading, startTransition] = useTransition()

  const form = useForm({
    initialValues: {
      account_code: String(loan.lnAccCode),
      loan_date: loan.disburseDate,
      remarks: loan.remarks,
      loan_id: loan.loan_id,
      loan_amount: loan.LnAmount - loan.profit_amt,
      profit_amount: loan.profit_amt,
      total_loan_amount: loan.LnAmount,
      service_charge: loan.sCharge,
      application_fees: loan.application_fees,
      revenue_charge: loan.revenue_charge,
      payment_frequency: loan.pay_frequency,
      loan_tenure: loan.tenure,
      payment_completion_date: loan.loanDateEnd,
      installment_amount: loan.emi,
      approved_by: String(loan.apprvBy),
      risk_amt_share: loan.risk_amt_share,
      risk_amt_deposit: loan.risk_amt_deposit,
      risk_amt_gr_1: loan.risk_amt_gr_1,
      memberId_gr_1: loan.mCode_gr_1,
      risk_amt_gr_2: loan.risk_amt_gr_2,
      memberId_gr_2: loan.mCode_gr_2,
      risk_amt_gr_3: loan.risk_amt_gr_3,
      memberId_gr_3: loan.mCode_gr_3,
      risk_amt_authority: loan.risk_amt_authority
    }
  })

  const { onSubmit, getInputProps, values, reset, setValues, setFieldValue } = form

  // Calculate total loan amount when loan_amount or profit_amount changes
  useEffect(() => {
    const loanAmount = Number(values.loan_amount) || 0
    const profitAmount = Number(values.profit_amount) || 0
    const total = loanAmount + profitAmount

    // Only update if the value actually changed
    if (Number(values.total_loan_amount) !== total) {
      setFieldValue('total_loan_amount', total)
    }
  }, [values.loan_amount, values.profit_amount])

  // Calculate completion date and installment when frequency, tenure or loan date changes
  useEffect(() => {
    if (values.payment_frequency && values.loan_tenure && values.loan_date) {
      const totalLoan = Number(values.total_loan_amount) || 0
      const tenure = Number(values.loan_tenure) || 0
      const frequency = values.payment_frequency as 'W' | 'M'

      // Calculate completion date
      const date = new Date(values.loan_date)
      if (frequency === 'W') {
        date.setDate(date.getDate() + tenure * 7)
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
  }, [values.payment_frequency, values.loan_tenure, values.loan_date, values.total_loan_amount])

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (values: any) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to update this loan?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          try {
            const res = await updateKarzEHasanahLoan(loan.insert_key, values)
            if (res.success) {
              showNotification(getSuccessMessage(res?.message))
              onSuccess() // Call the success callback to refresh parent data
              closeAllModals()
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

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 12 }}>
        <form onSubmit={onSubmit(submitHandler)}>
          <Title order={4} mb="md">
            Karz-e-Hasanah Update Loan
          </Title>

          {/* Member ID Search */}
          <Paper shadow="xs" p="xs" mt="xs">
            <Grid gutter="xs" align="flex-end">
              <Grid.Col span={{ base: 8, md: 6 }}>
                <TextInput
                  label="Member ID"
                  mb="xs"
                  withAsterisk
                  value={memberId}
                  disabled
                  leftSection={<BiIdCard />}
                  placeholder="Enter member ID"
                />
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
                <NumberInput
                  label="Loan Amount"
                  {...getInputProps('loan_amount')}
                  mb="xs"
                  withAsterisk
                  hideControls
                  leftSection={<TbCoinTaka />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <NumberInput
                  label="Profit Amount"
                  {...getInputProps('profit_amount')}
                  mb="xs"
                  hideControls
                  disabled
                  leftSection={<TbCoinTaka />}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 3 }}>
                <NumberInput
                  label="Total Loan"
                  {...getInputProps('total_loan_amount')}
                  mb="xs"
                  disabled
                  hideControls
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
              <Grid.Col span={{ base: 6, md: 3 }}>
                <TextInput
                  label="Revenue Charge"
                  {...getInputProps('revenue_charge')}
                  mb="xs"
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
                  type="date"
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
            Update
          </Button>
        </form>
      </Grid.Col>
    </Grid>
  )
}

export default EditModal
