'use client'

import { addDifferentProjectTransactionsTransaction, deleteDifferentProjectTransactionsTransaction, getDifferentProjectTransactions } from '@actions/basic-accounting/different-project-transaction-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Menu,
  NumberInput,
  Paper,
  ScrollArea,
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
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useEffect, useState, useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { IoIosMore as MoreIcon } from 'react-icons/io'
import { IoCalendarOutline } from 'react-icons/io5'

const DifferentProjectTransactionPageUi = ({ accounts }: any) => {
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [transactions, setTransactions] = useState([])

  const form = useForm({
    initialValues: {
      transaction_date: initialDate,
      account_key_code: '',
      transaction_type: '',
      note: '',
      amount: ''
    }
  })

  // Function to load transactions for the selected account
  const loadTransactions = async (accountCode: string) => {
    if (!accountCode) {
      setTransactions([])
      return
    }

    setIsLoadingDetails(true)
    try {
      const transactionsRes = await getDifferentProjectTransactions(accountCode)
      if (transactionsRes.success) {
        setTransactions(transactionsRes.data || [])
      } else {
        showNotification(getErrorMessage(transactionsRes?.message))
        setTransactions([])
      }
    } catch (error) {
      showNotification(getErrorMessage(error?.message || 'Failed to load transactions'))
      setTransactions([])
    } finally {
      setIsLoadingDetails(false)
    }
  }

  useEffect(() => {
    const accountCode = form.values.account_key_code
    loadTransactions(accountCode)
  }, [form.values.account_key_code])

  const submit = () => {
    startTransition(async () => {
      try {
        const submissionData = {
          transaction_date: form.values.transaction_date,
          note: form.values.note,
          account_key_code: form.values.account_key_code,
          amount: form.values.amount,
          transaction_type: form.values.transaction_type
        }

        modals.openConfirmModal({
          title: 'Please confirm your action',
          children: <Text size="sm">Are you sure you want to process this transaction?</Text>,
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: async () => {
            try {
              const res = await addDifferentProjectTransactionsTransaction(submissionData)
              if (res.success) {
                showNotification(getSuccessMessage(res?.message))

                // Reset form but keep the account selection and date
                form.setValues({
                  transaction_type: '',
                  note: '',
                  amount: ''
                })

                // Reload transactions to show the new one
                await loadTransactions(form.values.account_key_code)
              } else {
                showNotification(getErrorMessage(res?.message))
              }
            } catch (error) {
              showNotification(getErrorMessage('Failed to create transaction'))
            }
          }
        })
      } catch (error) {
        showNotification(getErrorMessage('Failed to submit transaction'))
      }
    })
  }

  const deleteHandler = async (insert_key: string) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          const res = await deleteDifferentProjectTransactionsTransaction(insert_key)
          if (res.success) {
            showNotification({ ...getSuccessMessage(res.message), autoClose: 10000 })
            // Reload transactions after deletion
            await loadTransactions(form.values.account_key_code)
          } else {
            showNotification(getErrorMessage(res.message))
          }
        } catch (error) {
          showNotification(getErrorMessage('Failed to delete transaction'))
        }
      }
    })
  }

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Basic Accounting || Project Transaction" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submit)}>
              <Title order={6} mb="md">
                Make direct transactions against different projects of the organization
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

              <Textarea label="Transaction Note/Remarks" {...form.getInputProps('note')} mb="xs" />

              <Divider variant="dashed" my="sm" />

              <Select
                label="Account List"
                placeholder="Select account"
                data={accounts.map((data) => ({
                  value: String(data.value),
                  label: `${data.label}`
                }))}
                searchable
                withAsterisk
                mb="xs"
                {...form.getInputProps('account_key_code')}
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

              <Select
                label="Transaction Type"
                placeholder="Select Transaction Type"
                data={[
                  { value: '1', label: 'New Investment' },
                  { value: '2', label: 'Income from Project' },
                  { value: '3', label: 'Expenditure on Project' }
                ]}
                withAsterisk
                mb="xs"
                {...form.getInputProps('transaction_type')}
              />

              <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                Submit
              </Button>
            </form>
          </Paper>
        </Grid.Col>


        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="xs" p="xs">
            <Title order={4} mb="md">
              Transaction History
            </Title>
            {transactions.length > 0 && (
              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Account Details</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {transactions.map((transaction, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{transaction.trDate}</Table.Td>
                        <Table.Td>{transaction.account_details}</Table.Td>
                        <Table.Td>{transaction.amount?.toFixed(2)}</Table.Td>
                        <Table.Td>{transaction.transaction_type}</Table.Td>
                        <Table.Td>
                          <Menu withArrow>
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <MoreIcon />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item onClick={() => deleteHandler(transaction.insertKey)}>Delete</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  )
}

export default DifferentProjectTransactionPageUi