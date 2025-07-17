import { setupFiscalYear } from '@actions/fiscal-year-config'
import { Button, FileInput, Select, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { MdUpdate as UpdateIcon } from 'react-icons/md'
import { FaBuilding } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { FaRegFileAlt } from 'react-icons/fa'
import { BsBuilding } from 'react-icons/bs'
import { setupCompanyInfo } from '@actions/company-config'

const EditModal = ({ company }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    initialValues: {
      name: company.name,
      sName: company.sName,
      addr: company.addr,
      logo_file: null
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await setupCompanyInfo(formData)
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
        Setup Company Information
      </Title>
      <TextInput
        label="Company Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('name')}
        leftSection={<FaBuilding />} // Adds an icon
      />
      <TextInput
        label="Short Name"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('sName')}
        leftSection={<BsBuilding />} // Adds an icon
      />
      <TextInput
        label="Address"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('addr')}
        leftSection={<FaLocationDot />} // Adds an icon
      />
      <FileInput
        clearable
        mb="xs"
        label="Upload files"
        rightSection={<FaRegFileAlt />}
        placeholder="Upload files"
        {...getInputProps('logo_file')}
      />

      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
