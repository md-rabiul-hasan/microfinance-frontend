import { createServiceArea } from '@actions/settings/service-area-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { serviceAreaValidationSchema } from '@schemas/settings.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt, BiSave } from 'react-icons/bi'
import { CiLocationOn } from 'react-icons/ci'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(serviceAreaValidationSchema),
    initialValues: {
      zoneName: '',
      locCode: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createServiceArea(formData)
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
        Add Service Area
      </Title>
      {/* Product Name Input */}
      <TextInput
        label="Zone Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('zoneName')}
        leftSection={<CiLocationOn />} // Adds an icon
      />

      <Select
        label="Select Location"
        placeholder="Select Location"
        data={locations.map((data: any) => ({
          value: String(data.location_code),
          label: `${data.district} - ${data.ps}`
        }))}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />} // Adds an icon
        {...getInputProps('locCode')}
      />
      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
