import { updateServiceArea } from '@actions/service-area-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { employeeValidationSchema } from '@schemas/employee.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt } from 'react-icons/bi'
import { CiLocationOn } from 'react-icons/ci'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { FaIdCardAlt } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { PiCertificateFill } from 'react-icons/pi'
import { FaSquarePhone } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { updateEmployee } from '@actions/employee-config'
import { externalSavingAccountValidationSchema } from '@schemas/external-saving-account.schema'
import { updateExternalSavingAccount } from '@actions/external-saving-account-config'
import { CiBank } from 'react-icons/ci'
import { IoCardOutline } from 'react-icons/io5'
import { CiCreditCard2 } from 'react-icons/ci'

const EditModal = ({ account }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(externalSavingAccountValidationSchema),
    initialValues: {
      org_name: account.org_name,
      acc_name: account.acc_name,
      acc_number: account.acc_number
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await updateExternalSavingAccount(account.keyCode!, formData)
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
        Update External Savings Account
      </Title>
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
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
