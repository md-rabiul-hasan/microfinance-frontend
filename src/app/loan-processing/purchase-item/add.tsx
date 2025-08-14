import { createEmployee } from '@actions/settings/employee-config'
import { Button, NumberInput, Select, Text, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals, modals } from '@mantine/modals'
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
import { createBranch } from '@actions/settings/branch-config'
import { BiSolidBank } from 'react-icons/bi'
import { branchValidationSchema } from '@schemas/settings.schema'
import { generate7DigitId } from '@utils/utils'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { IoCalendarOutline } from 'react-icons/io5'
import { formatToYMD } from '@utils/datetime.util'
import { TbCoinTaka } from 'react-icons/tb'
import { GoHash } from 'react-icons/go'
import { FaPersonDotsFromLine } from 'react-icons/fa6'
import { purchaseItemValidationSchema } from '@schemas/loan-processing.schema'
import { createPurchaseItem } from '@actions/loan-processing/purchase-item-config'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()
  const productId = generate7DigitId()
  const initialDate = formatToYMD(getSessionTransactionDate())

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(purchaseItemValidationSchema),
    initialValues: {
      purchase_id: productId,
      purchase_details: '',
      purchase_date: initialDate,
      purchase_amount: '',
      purchase_from: '',
      remarks: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: any) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to add this purchase item?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await createPurchaseItem(formData)
          if (res.success) {
            showNotification(getSuccessMessage(res?.message)) // Show success notification
            closeAllModals() // Close the modal upon success
          } else {
            showNotification(getErrorMessage(res?.message)) // Show error notification
          }
        })
      }
    })
  }

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Add Purchase Item
      </Title>

      <TextInput
        label="Product ID"
        mb="xs"
        disabled
        withAsterisk // Marks the field as required
        {...getInputProps('purchase_id')}
        leftSection={<GoHash />} // Adds an icon
      />
      <Textarea label="Product Details" {...getInputProps('purchase_details')} withAsterisk mb="xs" />

      <NumberInput
        label="Purchase Cost (BDT)"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('purchase_amount')}
        hideControls
        leftSection={<TbCoinTaka />} // Adds an icon
      />

      <TextInput
        type="date"
        label="Purchase Date"
        mb="xs"
        {...getInputProps('purchase_date')}
        withAsterisk
        leftSection={<IoCalendarOutline />}
      />

      <TextInput
        label="Purchase From"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('purchase_from')}
        leftSection={<FaPersonDotsFromLine />} // Adds an icon
      />

      <Textarea label="Remarks" {...getInputProps('remarks')} withAsterisk mb="xs" />

      {/* Submit Button */}
      <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default AddModal
