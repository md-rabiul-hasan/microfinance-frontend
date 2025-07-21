import { updateServiceArea } from '@actions/settings/service-area-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { FaIdCardAlt } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { PiCertificateFill } from 'react-icons/pi'
import { FaSquarePhone } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { updateBranch } from '@actions/settings/branch-config'
import { BiSolidBank } from 'react-icons/bi'
import { branchValidationSchema } from '@schemas/settings.schema'

const EditModal = ({ branch }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(branchValidationSchema),
    initialValues: {
      name: branch.name,
      contact: branch.contact,
      addr: branch.addr
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await updateBranch(branch.keyCode!, formData)
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
        Update Branch
      </Title>

      <TextInput
        label="Branch Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('name')}
        leftSection={<BiSolidBank />} // Adds an icon
      />

      <TextInput
        label="Contact"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('contact')}
        leftSection={<FaSquarePhone />} // Adds an icon
      />

      <TextInput
        label="Address"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('addr')}
        leftSection={<FaLocationDot />} // Adds an icon
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
