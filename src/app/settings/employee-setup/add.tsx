import { createEmployee } from '@actions/settings/employee-config'
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
import { employeeValidationSchema } from '@schemas/settings.schema'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(employeeValidationSchema),
    initialValues: {
      emp_id: '',
      name: '',
      designation: '',
      contact: '',
      addr: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createEmployee(formData)
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
        Add Employee
      </Title>
      {/* Product Name Input */}
      <TextInput
        label="Employee ID"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('emp_id')}
        leftSection={<FaIdCardAlt />} // Adds an icon
      />

      <TextInput
        label="Employee Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('name')}
        leftSection={<MdPerson />} // Adds an icon
      />

      <TextInput
        label="Designation"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('designation')}
        leftSection={<PiCertificateFill />} // Adds an icon
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
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
