import { updateProject } from '@actions/settings/project-config'
import { Button, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { projectValidationSchema } from '@schemas/settings.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiSolidBank } from 'react-icons/bi'
import { FaLocationDot } from 'react-icons/fa6'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { PiNoteFill } from 'react-icons/pi'

const EditModal = ({ project }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(projectValidationSchema),
    initialValues: {
      project_name: project.project_name,
      project_location: project.project_location,
      project_details: project.project_details
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await updateProject(project.keyCode!, formData)
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
        Update Project Investment
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
        leftSection={<PiNoteFill />} // Adds an icon
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
