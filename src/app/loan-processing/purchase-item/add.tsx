import { createPurchaseItem } from '@actions/loan-processing/purchase-item-config'
import { Button, NumberInput, Text, Textarea, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals, modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { purchaseItemValidationSchema } from '@schemas/loan-processing.schema'
import { formatToYMD } from '@utils/datetime.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { generate7DigitId } from '@utils/utils'
import { useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { FaPersonDotsFromLine } from 'react-icons/fa6'
import { GoHash } from 'react-icons/go'
import { IoCalendarOutline } from 'react-icons/io5'
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { TbCoinTaka } from 'react-icons/tb'

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

      <TextInput
        label="Product Details"
        mb="xs"
        withAsterisk // Marks the field as required
        {...getInputProps('purchase_details')}
        leftSection={<MdOutlineProductionQuantityLimits />} // Adds an icon
      />

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
