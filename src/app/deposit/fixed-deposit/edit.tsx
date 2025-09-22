import { updateFdrDeposit } from '@actions/deposit/fixed-deposit-config'
import { Button, NumberInput, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { FixedDepositSetupValidationSchema } from '@schemas/deposit.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { RiUser3Line } from 'react-icons/ri'
import { TbCoinTaka } from 'react-icons/tb'

const EditModal = ({ deposit, memberId, memberName, memberKeyCode }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(FixedDepositSetupValidationSchema),
    initialValues: {
      member_key_code: memberKeyCode,
      fdr_length: deposit.period_in_month,
      amount: deposit.amount,
      opening_date: deposit.open_date,
      remarks: deposit.remarks
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) => startTransition(async () => {
    const res = await updateFdrDeposit(deposit.insert_key, formData)
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
        Update Member Fixed Deposit
      </Title>
      <TextInput
        label="Member Name"
        value={memberName ? `${memberName} (${memberId})` : ''}
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
        {...getInputProps('amount')}
        leftSection={<TbCoinTaka />}
      />

      <TextInput
        type="date"
        label="Opening Date"
        mb="xs"
        {...getInputProps('opening_date')}
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
        {...getInputProps('fdr_length')}
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
