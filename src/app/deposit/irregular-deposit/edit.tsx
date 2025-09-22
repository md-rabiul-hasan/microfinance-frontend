import { updateDeposit } from '@actions/deposit/regular-deposit-config'
import { Button, NumberInput, Select, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { RegularDepositSetupValidationSchema } from '@schemas/deposit.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt } from 'react-icons/bi'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'

const EditModal = ({ deposit, accounts, memberId, memberName, memberKeyCode }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(RegularDepositSetupValidationSchema),
    initialValues: {
      member_key_code: memberKeyCode,
      account_code: String(deposit.acc_code),
      amount: deposit.amt,
      deposit_date: deposit.trDate,
      remarks: deposit.description
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) => startTransition(async () => {
    const res = await updateDeposit(deposit.insertKey, formData)
    if (res.success) {
      showNotification(getSuccessMessage(res?.message)) // Show success notification
      closeAllModals() // Close the modal upon success
    } else {
      showNotification(getErrorMessage(res?.message)) // Show error notification
    }
  })

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Update Member Deposit
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
        {...getInputProps('account_code')}
      />

      <NumberInput
        label="Deposit Amount"
        decimalScale={2}
        fixedDecimalScale
        mb="xs"
        withAsterisk
        {...getInputProps('amount')}
        leftSection={<TbCoinTaka />}
      />

      <TextInput
        type="date"
        label="Deposit Date"
        mb="xs"
        {...getInputProps('deposit_date')}
        withAsterisk
        leftSection={<IoCalendarOutline />}
      />

      <Textarea label="Remarks" {...getInputProps('remarks')} withAsterisk mb="xs" />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
