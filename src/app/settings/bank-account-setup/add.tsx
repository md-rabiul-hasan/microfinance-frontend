import { createEmployee } from '@actions/employee-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { employeeValidationSchema } from '@schemas/employee.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { BiSave } from 'react-icons/bi'
import { FaIdCardAlt } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { PiCertificateFill } from 'react-icons/pi'
import { FaSquarePhone } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { BiCategoryAlt } from 'react-icons/bi'
import { bankAccountValidationSchema } from '@schemas/bank-account.schema'
import { createBankAccount } from '@actions/bank-account-config'
import { AiTwotoneBank } from 'react-icons/ai'
import { MdOutlineSubtitles } from 'react-icons/md'
import { CiCreditCard1 } from 'react-icons/ci'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(bankAccountValidationSchema),
    initialValues: {
      bank_name: '',
      acc_name: '',
      acc_number: '',
      acc_flag: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createBankAccount(formData)
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
        Add Bank Account
      </Title>
      {/* Product Name Input */}
      <TextInput
        label="Bank Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('bank_name')}
        leftSection={<AiTwotoneBank />} // Adds an icon
      />

      <TextInput
        label="Account Title"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('acc_name')}
        leftSection={<MdOutlineSubtitles />} // Adds an icon
      />

      <TextInput
        label="Account Number"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('acc_number')}
        leftSection={<CiCreditCard1 />} // Adds an icon
      />

      <Select
        label="Account Type"
        placeholder="Select Account Type"
        data={[
          { value: '0', label: 'General Account' },
          { value: '1', label: 'Provident Fund' },
          { value: '2', label: 'Gratuity Fund' }
        ]}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />}
        {...getInputProps('acc_flag')} // Use appropriate field name for your form
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
