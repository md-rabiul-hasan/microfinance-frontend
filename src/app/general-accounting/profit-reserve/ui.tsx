'use client'

import { createProfitEntry } from '@actions/general-accounting/profit-reserve-config'
import TitleBar from '@components/common/title-bar'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Select,
  Textarea,
  TextInput,
  Title,
  NumberInput,
  Text
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { yupResolver } from '@mantine/form'
import { formatToYMD } from '@utils/datetime.util'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { IoCalendarOutline } from 'react-icons/io5'
import { showNotification } from '@mantine/notifications'
import { MdAccountBalance } from 'react-icons/md'
import { profitReserveValidationSchema } from '@schemas/general-accounting.schema'

const ProfitReservePageUi = () => {
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values, reset } = useForm({
    validate: yupResolver(profitReserveValidationSchema),
    initialValues: {
      transaction_date: initialDate,
      account_code: '29995',
      transaction_type: '',
      amount: '',
      narration: ''
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to create a profit reserve entry.
   */
  const submitHandler = (formData: any) => {
    startTransition(async () => {
      try {
        const res = await createProfitEntry(formData)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message))
          reset() // Reset the form upon success
        } else {
          showNotification(getErrorMessage(res?.message))
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to create profit reserve entry'))
      }
    })
  }

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="General Accounting || Profit entry " url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={onSubmit(submitHandler)}>
              <Title order={4} mb="md">
                Reserve profit from the previous year
              </Title>

              <TextInput
                type="date"
                label="Transaction Date"
                {...getInputProps('transaction_date')}
                mb="xs"
                withAsterisk
                leftSection={<IoCalendarOutline />}
              />

              <TextInput
                label="Transaction Account"
                placeholder="Enter account code"
                {...getInputProps('account_code')}
                mb="xs"
                withAsterisk
                readOnly
                leftSection={<MdAccountBalance />}
              />

              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                withAsterisk
                hideControls
                mb="xs"
                min={0}
                {...getInputProps('amount')}
              />

              <Select
                label="Transaction Type"
                placeholder="Select Transaction Type"
                data={[
                  { value: 'D', label: 'Debit' },
                  { value: 'C', label: 'Credit' }
                ]}
                withAsterisk
                mb="xs"
                {...getInputProps('transaction_type')}
              />

              <Textarea
                label="Narration (if any)"
                placeholder="Enter narration"
                {...getInputProps('narration')}
                mb="xs"
              />

              <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                Submit
              </Button>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default ProfitReservePageUi
