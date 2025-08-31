import { createServiceArea } from '@actions/settings/service-area-config'
import { createNewUser } from '@actions/user-and-security/new-user-config'
import { Button, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { serviceAreaValidationSchema } from '@schemas/settings.schema'
import { newUserValidationSchema } from '@schemas/user-security.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiCategoryAlt, BiSave } from 'react-icons/bi'
import { CiLocationOn } from 'react-icons/ci'
import { FaIdCardClip } from 'react-icons/fa6'
import { RiLockPasswordLine } from 'react-icons/ri'

const AddModal = ({ employees, branches, roles }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(newUserValidationSchema),
    initialValues: {
      zoneName: '',
      employee_key_code: '',
      permission_type: '',
      branch_key_code: '',
      user_id: '',
      password: 'KarzBook@123',
      role_key_code: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createNewUser(formData)
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
        Add User
      </Title>
      {/* Product Name Input */}

      <Select
        label="Select Employee"
        placeholder="Please select"
        data={employees.map((data: any) => ({
          value: String(data.keyCode),
          label: `${data.name} || ${data.emp_id}`
        }))}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />} // Adds an icon
        {...getInputProps('employee_key_code')}
      />
      <Select
        label="Permission Type"
        placeholder="Please select permission type"
        data={[
          { value: '0', label: 'View Permission' },
          { value: '1', label: 'Insert Permission' },
          { value: '2', label: 'Insert and Update Permission' },
          { value: '9', label: 'Insert, Update and Delete Permission' }
        ]}
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />}
        {...getInputProps('permission_type')}
      />
      <Select
        label="Select Branch"
        placeholder="Please select"
        data={branches.map((data: any) => ({
          value: String(data.keyCode),
          label: `${data.name}`
        }))}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />} // Adds an icon
        {...getInputProps('branch_key_code')}
      />

      <TextInput
        label="User ID"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('user_id')}
        leftSection={<FaIdCardClip />} // Adds an icon
      />

      <TextInput
        label="Default Password"
        mb="xs"
        withAsterisk // Marks the field as required
        readOnly
        {...getInputProps('password')}
        leftSection={<RiLockPasswordLine />} // Adds an icon
      />

      <Select
        label="Role"
        placeholder="Please select"
        data={roles.map((data: any) => ({
          value: String(data.keyCode),
          label: `${data.roleName} || ${data.remarks}`
        }))}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />} // Adds an icon
        {...getInputProps('role_key_code')}
      />

      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
