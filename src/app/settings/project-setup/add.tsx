import { createEmployee } from '@actions/employee-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { BiSave } from 'react-icons/bi'
import { FaIdCardAlt } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { PiCertificateFill } from 'react-icons/pi'
import { FaSquarePhone } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { branchValidationSchema } from '@schemas/branch.schema'
import { createBranch } from '@actions/branch-config'
import { BiSolidBank } from 'react-icons/bi'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(branchValidationSchema),
    initialValues: {
      project_name: '',
      project_location: '',
      project_details: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createBranch(formData)
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
        Add Project Investment
      </Title>

      <TextInput
        label="Project Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('project_name')}
        leftSection={<BiSolidBank />} // Adds an icon
      />

      <TextInput
        label="Location"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('project_location')}
        leftSection={<FaLocationDot />} // Adds an icon
      />

      <TextInput
        label="Details"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('project_details')}
        leftSection={<FaSquarePhone />} // Adds an icon
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
