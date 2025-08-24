'use client'

import { createJournalEntry, getSubAccountHead } from '@actions/general-accounting/journal-entry-config'
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
  Loader,
  NumberInput,
  Divider,
  Table,
  ActionIcon,
  Box,
  ScrollArea,
  Text
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { formatToYMD } from '@utils/datetime.util'
import { getSessionTransactionDate } from '@utils/transaction-date'
import { useState, useTransition, useEffect } from 'react'
import { BiSave } from 'react-icons/bi'
import { IoCalendarOutline } from 'react-icons/io5'
import { showNotification } from '@mantine/notifications'
import { FaTrash } from 'react-icons/fa'
import { modals } from '@mantine/modals'

const JournalEntryPageUi = ({ accounts }: any) => {
  const initialDate = formatToYMD(getSessionTransactionDate())
  const [isLoading, startTransition] = useTransition()
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [subAccountList, setSubAccountList] = useState([])
  const [hasSubAccountHead, setHasSubAccountHead] = useState(false)
  const [subHeadTable, setSubHeadTable] = useState('')
  const [transactionGrid, setTransactionGrid] = useState([])

  const form = useForm({
    initialValues: {
      transaction_date: initialDate,
      account_code: '',
      sub_account_key_code: '',
      transaction_type: '',
      remarks: '',
      amount: '',
      narration: ''
    }
  })

  // Use useEffect to automatically call API when account_code changes
  useEffect(() => {
    const accountCode = form.values.account_code

    if (accountCode) {
      const loadAccountDetails = async () => {
        setIsLoadingDetails(true)
        try {
          const res = await getSubAccountHead(accountCode)
          if (res.success) {
            setHasSubAccountHead(res.data.has_sub_accounts)
            if (res.data.has_sub_accounts) {
              setSubAccountList(res.data.data.options)
              setSubHeadTable(res.data.data.subHeadTable)
              form.setFieldValue('sub_account_key_code', '')
            } else {
              setSubAccountList([])
              form.setFieldValue('sub_account_key_code', '0')
            }
          } else {
            showNotification(getErrorMessage(res?.message))
          }
        } catch (error) {
          console.error('Failed to load account details:', error)
          showNotification(getErrorMessage(error?.message || 'Failed to load account details'))
        } finally {
          setIsLoadingDetails(false)
        }
      }
      loadAccountDetails()
    } else {
      setHasSubAccountHead(false)
      setSubAccountList([])
      form.setFieldValue('sub_account_key_code', '0')
    }
  }, [form.values.account_code])

  const getAccountName = (accountCode: any) => {
    const account = accounts.find((acc: any) => String(acc.acc_code) === accountCode)
    return account ? account.acc_name : 'Unknown Account'
  }

  const getSubAccountName = (accountType: any) => {
    if (accountType === '0') return 'Not Applicable'
    const subAccount = subAccountList.find((acc: any) => String(acc.keyCode) === accountType)
    return subAccount ? subAccount?.details : 'Unknown Sub Account'
  }

  const addToTransactionGrid = (values: any) => {
    // Validate required fields
    if (!values.account_code) {
      showNotification(getErrorMessage('Please select an account'))
      return
    }

    if (!values.transaction_type) {
      showNotification(getErrorMessage('Please select a transaction type (Debit/Credit)'))
      return
    }

    if (!values.amount || parseFloat(values.amount) <= 0) {
      showNotification(getErrorMessage('Please enter a valid amount'))
      return
    }

    // For accounts with sub-accounts, validate that one is selected
    if (hasSubAccountHead && !values.sub_account_key_code) {
      showNotification(getErrorMessage('Please select a sub account'))
      return
    }

    const newTransaction = {
      id: Date.now().toString(),
      account_code: values.account_code,
      account_name: getAccountName(values.account_code),
      sub_account_key_code: values.sub_account_key_code || '0',
      sub_account_name: getSubAccountName(values.sub_account_key_code),
      sub_head_table: subHeadTable,
      transaction_type: values.transaction_type,
      amount: parseFloat(values.amount),
      narration: values.narration
    }

    setTransactionGrid([...transactionGrid, newTransaction])

    // Reset form fields except transaction_date and remarks
    form.setValues({
      ...form.values,
      account_code: '',
      sub_account_key_code: '',
      transaction_type: '',
      amount: '',
      narration: ''
    })

    setHasSubAccountHead(false)
    setSubAccountList([])
  }

  const removeFromTransactionGrid = (id: any) => {
    setTransactionGrid(transactionGrid.filter((item: any) => item.id !== id))
  }

  const submitAllTransactions = () => {
    startTransition(async () => {
      try {
        // Prepare data for submission
        const submissionData = {
          transaction_date: form.values.transaction_date,
          note: form.values.remarks,
          transactions: transactionGrid
        }

        modals.openConfirmModal({
          title: 'Please confirm your action',
          children: <Text size="sm">Are you sure you want to process this member amount withdraw?</Text>,
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: () => {
            startTransition(async () => {
              try {
                const res = await createJournalEntry(submissionData)
                console.log('res', res)
                if (res.success) {
                  showNotification(getSuccessMessage(res?.message))
                } else {
                  showNotification(getErrorMessage(res?.message))
                }
              } catch (error) {
                showNotification(getErrorMessage('Failed to create withdrawal'))
              }
            })
          }
        })
      } catch (error) {
        console.error('Submission error:', error)
        showNotification(getErrorMessage('Failed to submit transactions'))
      }
    })
  }

  const totalDebit = transactionGrid
    .filter((item) => item.transaction_type === 'DR')
    .reduce((sum, item) => sum + item.amount, 0)

  const totalCredit = transactionGrid
    .filter((item) => item.transaction_type === 'CR')
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <Container fluid>
      <Group justify="space-between" mb="xs">
        <TitleBar title="General Accounting || Journal entry" url="/" />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="xs" p="xs">
            <form onSubmit={form.onSubmit(addToTransactionGrid)}>
              <Title order={4} mb="md">
                Transaction by mapping debit-credit
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
                data={accounts.map((data) => ({
                  value: String(data.acc_code),
                  label: `${data.acc_name} || ${data.acc_code}`
                }))}
                searchable
                withAsterisk
                mb="xs"
                {...form.getInputProps('account_code')}
              />

              {form.values.account_code &&
                (hasSubAccountHead ? (
                  <Select
                    label="Sub Account"
                    placeholder={isLoadingDetails ? 'Loading options...' : 'Select sub account'}
                    data={subAccountList.map((data) => ({
                      value: String(data.keyCode),
                      label: `${data.details}`
                    }))}
                    disabled={isLoadingDetails}
                    searchable
                    withAsterisk
                    mb="xs"
                    rightSection={isLoadingDetails ? <Loader size="xs" /> : null}
                    {...form.getInputProps('sub_account_key_code')}
                  />
                ) : (
                  <TextInput label="Sub Account" value="Not Applicable" disabled={true} mb="xs" />
                ))}

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
                  { value: 'DR', label: 'Debit' },
                  { value: 'CR', label: 'Credit' }
                ]}
                withAsterisk
                mb="xs"
                {...form.getInputProps('transaction_type')}
              />

              <Textarea label="Narration (if any)" {...form.getInputProps('narration')} mb="xs" />

              <Button type="submit" leftSection={<BiSave />} loading={isLoading}>
                Add To Transaction Grid
              </Button>
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
                <ScrollArea>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Account</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Narration</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {transactionGrid.map((transaction) => (
                        <Table.Tr key={transaction.id}>
                          <Table.Td>
                            <Box>
                              <Text size="sm">{transaction.account_name}</Text>
                              <Text size="xs" c="dimmed">
                                {transaction.sub_account_name}
                              </Text>
                            </Box>
                          </Table.Td>
                          <Table.Td>{transaction.transaction_type}</Table.Td>
                          <Table.Td>{transaction.amount.toFixed(2)}</Table.Td>
                          <Table.Td>{transaction.narration}</Table.Td>
                          <Table.Td>
                            <ActionIcon color="red" onClick={() => removeFromTransactionGrid(transaction.id)}>
                              <FaTrash size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>

                <Divider my="md" />

                <Group justify="space-between">
                  <Text fw={500}>Total Debit: {totalDebit.toFixed(2)}</Text>
                  <Text fw={500}>Total Credit: {totalCredit.toFixed(2)}</Text>
                </Group>

                <Button
                  fullWidth
                  mt="md"
                  onClick={submitAllTransactions}
                  disabled={transactionGrid.length === 0 || totalDebit !== totalCredit}
                  color={totalDebit === totalCredit ? 'blue' : 'red'}
                  loading={isLoading}
                >
                  {totalDebit === totalCredit
                    ? `Submit All Transactions (${transactionGrid.length})`
                    : 'Debit and Credit must be equal'}
                </Button>
              </>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default JournalEntryPageUi
