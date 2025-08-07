import { updateServiceArea } from '@actions/settings/service-area-config'
import { Button, NumberInput, Select, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
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
import { updateEmployee } from '@actions/settings/employee-config'
import { employeeValidationSchema } from '@schemas/settings.schema'
import { TbCoinTaka } from 'react-icons/tb'
import { IoCalendarOutline } from 'react-icons/io5'
import { RiUser3Line } from 'react-icons/ri'

const EditModal = ({ deposit, accounts, memberId, memberName }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(employeeValidationSchema),
    initialValues: {
      member_key_code: '',
      account_code: String(deposit.acc_code),
      amount: deposit.amt,
      deposit_date: deposit.trDate,
      remarks: deposit.description
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) => startTransition(async () => {})

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Update Member Deposit
      </Title>
      <TextInput
        label="Member Name"
        value={memberName ? `${memberName} (${memberId})` : ''}
        readOnly
        mb="xs"
        withAsterisk
        leftSection={<RiUser3Line />}
      />
      <Select
        label="Deposit Against"
        placeholder="Please Select"
        data={accounts.map((data: any) => ({
          value: String(data.accountCode),
          label: `${data.AccountDisplayName} - ${data.accountCode}`
        }))}
        searchable
        withAsterisk
        mb="xs"
        leftSection={<BiCategoryAlt />}
        {...getInputProps('account_code')}
      />

      <NumberInput
        label="Deposit Amount"
        decimalScale={2}
        fixedDecimalScale
        mb="xs"
        withAsterisk
        {...getInputProps('amount')}
        leftSection={<TbCoinTaka />}
      />

      <TextInput
        type="date"
        label="Deposit Date"
        mb="xs"
        {...getInputProps('deposit_date')}
        withAsterisk
        leftSection={<IoCalendarOutline />}
      />

      <Textarea label="Remarks" {...getInputProps('remarks')} withAsterisk mb="xs" />

      {/* Submit Button */}
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditModal
