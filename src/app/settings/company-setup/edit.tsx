import { setupFiscalYear } from '@actions/fiscal-year-config'
import { Button, Select, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { MdUpdate as UpdateIcon } from 'react-icons/md'

const EditModal = ({ formatCode }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    initialValues: {
      formatCode: String(formatCode)
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await setupFiscalYear(formData)
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
        Setup Fiscal Year
      </Title>


      <Select
        label="Select Format"
        placeholder="Select Format"
        data={[
          { value: "1", label: "January to December" },
          { value: "2", label: "June to June" }
        ]}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />}
        {...getInputProps('formatCode')} // Changed from 'locCode' to 'formatCode' to match your context
      />


      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
