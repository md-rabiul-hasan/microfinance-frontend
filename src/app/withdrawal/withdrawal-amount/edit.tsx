import { updateWithdrawal } from '@actions/withdrawal/withdrawal-amount-config'
import { Button, NumberInput, Select, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { WithdrawalAmountSetupValidationSchema } from '@schemas/withdrawal.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt } from 'react-icons/bi'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'

interface EditModalProps {
  withdrawal: any
  accounts: any[]
  memberId: string
  memberName: string
  memberKeyCode: number
  onSuccess: () => void // Add this prop to handle success callback
}

const EditModal = ({ withdrawal, accounts, memberId, memberName, memberKeyCode, onSuccess }: EditModalProps) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps } = useForm({
    validate: yupResolver(WithdrawalAmountSetupValidationSchema),
    initialValues: {
      member_key_code: memberKeyCode,
      account_code: String(withdrawal.acc_code),
      amount: withdrawal.amt,
      withdraw_date: withdrawal.trDate,
      remarks: withdrawal.description || ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the withdrawal details.
   */
  const submitHandler = (formData: any) => {
    startTransition(async () => {
      try {
        const res = await updateWithdrawal(withdrawal.insertKey, formData)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message)) // Show success notification
          onSuccess() // Call the success callback to refresh parent data
          closeAllModals() // Close the modal upon success
        } else {
          showNotification(getErrorMessage(res?.message)) // Show error notification
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to update withdrawal'))
      }
    })
  }

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Update Member Withdrawal
      </Title>

      <TextInput
        label="Member Name"
        value={memberName ? `${memberName} (${memberId})` : ''}
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
        {...getInputProps('account_code')}
      />

      <NumberInput
        label="Withdrawal Amount (BDT)"
        decimalScale={2}
        fixedDecimalScale
        hideControls
        mb="xs"
        withAsterisk
        {...getInputProps('amount')}
        leftSection={<TbCoinTaka />}
      />

      <TextInput
        type="date"
        label="Withdrawal Date"
        mb="xs"
        {...getInputProps('withdraw_date')}
        withAsterisk
        leftSection={<IoCalendarOutline />}
      />

      <Textarea
        label="Remarks"
        {...getInputProps('remarks')}
        withAsterisk
        mb="xs"
        placeholder="Enter remarks about this withdrawal"
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal