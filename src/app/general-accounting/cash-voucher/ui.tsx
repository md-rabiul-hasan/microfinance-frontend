'use client'

import { createCashVoucherTransaction } from '@actions/general-accounting/cash-voucher-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { formatToYMD } from '@utils/datetime.util'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { usePermissions } from '@utils/permission'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { IoCalendarOutline } from 'react-icons/io5'

const CashVoucherPageUi = ({ accounts }: any) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [transactionGrid, setTransactionGrid] = useState([])

  const form = useForm({
    initialValues: {
      transaction_date: initialDate,
      account_code: '',
      transaction_type: 'debit', // Default transaction type
      remarks: '',
      amount: '',
      narration: ''
    }
  })

  const getAccountName = (accountCode: any) => {
    const account = accounts.find((acc: any) => String(acc.acc_code) === accountCode)
    return account ? account.acc_name : 'Unknown Account'
  }

  const addToTransactionGrid = (values: any) => {
    // Validate required fields
    if (!values.account_code) {
      showNotification(getErrorMessage('Please select an account'))
      return
    }

    if (!values.amount || parseFloat(values.amount) <= 0) {
      showNotification(getErrorMessage('Please enter a valid amount'))
      return
    }

    const newTransaction = {
      id: Date.now().toString(),
      account_code: values.account_code,
      account_name: getAccountName(values.account_code),
      amount: parseFloat(values.amount),
      narration: values.narration
    }

    setTransactionGrid([...transactionGrid, newTransaction])

    // Reset form fields except transaction_date and remarks
    form.setValues({
      ...form.values,
      account_code: '',
      amount: '',
      narration: ''
    })
  }

  const removeFromTransactionGrid = (id: any) => {
    setTransactionGrid(transactionGrid.filter((item: any) => item.id !== id))
  }

  const submitAllTransactions = () => {
    // Validate that we have at least one transaction
    if (transactionGrid.length === 0) {
      showNotification(getErrorMessage('Please add at least one transaction'))
      return
    }

    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to process this cash voucher?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          try {
            // Prepare data for submission
            const submissionData = {
              transaction_date: form.values.transaction_date,
              note: form.values.remarks,
              transactions: transactionGrid
            }

            const res = await createCashVoucherTransaction(submissionData)
            if (res.success) {
              showNotification(getSuccessMessage(res?.message))
              // Clear the transaction grid after successful submission
              setTransactionGrid([])
            } else {
              showNotification(getErrorMessage(res?.message))
            }
          } catch (error) {
            showNotification(getErrorMessage('Failed to submit transactions'))
          }
        })
      }
    })
  }

  const totalAmount = transactionGrid.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="General Accounting || Cash Voucher" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(addToTransactionGrid)}>
              <Title order={4} mb="md">
                Direct cash voucher / petty cash
              </Title>

              <TextInput
                type="date"
                label="Transaction Date"
                {...form.getInputProps('transaction_date')}
                readOnly
                mb="xs"
                withAsterisk
                leftSection={<IoCalendarOutline />}
              />

              <Textarea label="Transaction Note/Remarks (if any)" {...form.getInputProps('remarks')} mb="xs" />

              <Divider variant="dashed" my="sm" />

              <Select
                label="Transaction Account"
                placeholder="Please Select Account"
                data={accounts.map((data: any) => ({
                  value: String(data.acc_code),
                  label: `${data.acc_name} || ${data.acc_code}`
                }))}
                searchable
                withAsterisk
                mb="xs"
                {...form.getInputProps('account_code')}
              />

              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                withAsterisk
                hideControls
                mb="xs"
                min={0}
                {...form.getInputProps('amount')}
              />

              <Textarea label="Narration (if any)" {...form.getInputProps('narration')} mb="xs" />

              {
                canCreate ? <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                  Add To Transaction Grid
                </Button> : null
              }

            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="xs" p="xs">
            <Title order={4} mb="md">
              Transaction Grid
            </Title>

            {transactionGrid.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No transactions added yet
              </Text>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Account</Table.Th>
                      <Table.Th>Narration</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {transactionGrid.map((transaction) => (
                      <Table.Tr key={transaction.id}>
                        <Table.Td>{transaction.account_name}</Table.Td>
                        <Table.Td>{transaction.narration}</Table.Td>
                        <Table.Td>{transaction.amount.toFixed(2)}</Table.Td>
                        <Table.Td>
                          <ActionIcon color="red" onClick={() => removeFromTransactionGrid(transaction.id)}>
                            <FaTrash size={14} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Divider my="md" />

                <Group justify="space-between">
                  <Text fw={500}>Total Amount: {totalAmount.toFixed(2)}</Text>
                  <Text size="sm" c="dimmed">
                    {transactionGrid.length} transaction(s)
                  </Text>
                </Group>

                {
                  canCreate ? <Button fullWidth mt="md" onClick={submitAllTransactions} loading={isLoading}>
                    Process Cash Voucher
                  </Button> : null
                }

              </>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default CashVoucherPageUi
