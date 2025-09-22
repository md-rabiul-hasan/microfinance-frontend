'use client'

import { addBasicBankingTransaction, deleteBankingTransaction, getBankingAccountCategoryTransactionList, getBankingTransactionAccountList } from '@actions/basic-accounting/banking-transaction-config'
import TitleBar from '@components/common/title-bar'
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
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

const BankingTransactionPageUi = () => {
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [accountList, setAccountList] = useState([])
  const [transactions, setTransactions] = useState([])

  const form = useForm({
    initialValues: {
      transaction_date: initialDate,
      account_key_code: '',
      account_category: '',
      transaction_type: '',
      note: '',
      amount: ''
    }
  })

  useEffect(() => {
    const accountCategory = form.values.account_category

    if (accountCategory) {
      const loadAccountList = async () => {
        setIsLoadingDetails(true)
        try {
          const res = await getBankingTransactionAccountList(accountCategory)
          const transactionsRes = await getBankingAccountCategoryTransactionList(accountCategory)
          if (res.success) {
            setAccountList(res.data)
            setTransactions(transactionsRes.data)
          } else {
            showNotification(getErrorMessage(res?.message))
          }
        } catch (error) {
          showNotification(getErrorMessage(error?.message || 'Failed to load account details'))
        } finally {
          setIsLoadingDetails(false)
        }
      }
      loadAccountList()
    } else {
      setAccountList([])
    }
  }, [form.values.account_category])

  const submit = () => {
    startTransition(async () => {
      try {
        const submissionData = {
          transaction_date: form.values.transaction_date,
          note: form.values.note,
          account_category: form.values.account_category,
          account_key_code: form.values.account_key_code,
          amount: form.values.amount,
          transaction_type: form.values.transaction_type
        }

        modals.openConfirmModal({
          title: 'Please confirm your action',
          children: <Text size="sm">Are you sure you want to process this transaction?</Text>,
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: () => {
            startTransition(async () => {
              try {
                const res = await addBasicBankingTransaction(submissionData)
                if (res.success) {
                  showNotification(getSuccessMessage(res?.message))
                } else {
                  showNotification(getErrorMessage(res?.message))
                }
              } catch (error) {
                showNotification(getErrorMessage('Failed to create transaction'))
              }
            })
          }
        })
      } catch (error) {
        showNotification(getErrorMessage('Failed to submit transaction'))
      }
    })
  }

  const deleteHandler = (insert_key: string) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to delete this?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteBankingTransaction(insert_key)
          if (res.success) {
            showNotification({ ...getSuccessMessage(res.message), autoClose: 10000 })
          } else {
            showNotification(getErrorMessage(res.message))
          }
        })
      }
    })
  }

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="Basic Accounting || Banking Transaction" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(submit)}>
              <Title order={6} mb="md">
                Make direct transactions into Bank Account
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
                label="Account Category"
                placeholder="Please Select"
                data={[
                  { value: "", label: "-Select-" },
                  { value: "1", label: "Current or Savings Account" },
                  { value: "2", label: "FDR Account" }
                ]}
                searchable
                withAsterisk
                mb="xs"
                {...form.getInputProps('account_category')}
              />

              {form.values.account_category && accountList && (
                <Select
                  label="Account List"
                  placeholder={isLoadingDetails ? 'Loading options...' : 'Select account'}
                  data={accountList.map((data) => ({
                    value: String(data.keyCode),
                    label: `${data.bank_name} - ${data.acc_name} - A/C: ${data.acc_number}`
                  }))}
                  disabled={isLoadingDetails}
                  searchable
                  withAsterisk
                  mb="xs"
                  rightSection={isLoadingDetails ? <Loader size="xs" /> : null}
                  {...form.getInputProps('account_key_code')}
                />
              )}

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
                  { value: '1', label: 'Regular Deposit' },
                  { value: '2', label: 'Regular Withdrawal' },
                  { value: '3', label: 'Profit Receive' },
                  { value: '4', label: 'Charge Payment' },
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

        {transactions.length > 0 && (
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper shadow="xs" p="xs">
              <Title order={4} mb="md">
                Transaction History
              </Title>
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
            </Paper>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  )
}

export default BankingTransactionPageUi