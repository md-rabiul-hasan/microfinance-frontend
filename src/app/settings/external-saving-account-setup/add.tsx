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
import { createExternalSavingAccount } from '@actions/settings/external-saving-account-config'
import { CiBank } from 'react-icons/ci'
import { IoCardOutline } from 'react-icons/io5'
import { CiCreditCard2 } from 'react-icons/ci'
import { externalSavingAccountValidationSchema } from '@schemas/settings.schema'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(externalSavingAccountValidationSchema),
    initialValues: {
      org_name: '',
      acc_name: '',
      acc_number: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createExternalSavingAccount(formData)
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
        Add External Savings Account
      </Title>
      {/* Product Name Input */}
      <TextInput
        label="Organization Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('org_name')}
        leftSection={<CiBank />} // Adds an icon
      />

      <TextInput
        label="Account Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('acc_name')}
        leftSection={<IoCardOutline />} // Adds an icon
      />

      <TextInput
        label="Account Number"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('acc_number')}
        leftSection={<CiCreditCard2 />} // Adds an icon
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
