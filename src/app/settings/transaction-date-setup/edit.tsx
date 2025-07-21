import { setupFiscalYear } from '@actions/fiscal-year-config'
import { Button, Select, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt } from 'react-icons/bi'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { DateInput } from '@mantine/dates'
import { setupTransactionDate } from '@actions/transaction-date-config'

const EditModal = ({ trnDate }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    initialValues: {
      trnDate: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await setupTransactionDate(formData)
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
        Setup Transaction Date
      </Title>

      <DateInput
        label="Transaction Date"
        placeholder="Select date"
        withAsterisk
        mb="md"
        leftSection={<BiCategoryAlt />}
        valueFormat="DD-MM-YYYY"
        {...getInputProps('trnDate')}
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
