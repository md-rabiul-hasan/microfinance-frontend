'use client'

import { addAccountInChartOfAccount } from '@actions/general-accounting/account-setup-config'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Input,
  List,
  Modal,
  NumberInput,
  Paper,
  rem,
  Select,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { usePermissions } from '@utils/permission'
import { useMemo, useState, useTransition } from 'react'
import { BiChevronDown, BiChevronRight, BiFolder, BiFolderOpen, BiPlus, BiSave, BiSearch } from 'react-icons/bi'
import { FiLayers } from 'react-icons/fi'

interface SubAccount {
  key_code: number
  details: string
  level: number
}

interface Account {
  account_code: number
  account_name: string
  type: string
  children?: Account[]
  sub_accounts?: SubAccount[]
}

interface AccountData {
  assets: Account[]
  liabilities: Account[]
  expenditure: Account[]
  income: Account[]
}

interface AccountSetupUiProps {
  accounts: AccountData
}

// Mock API function - replace with actual API call
const createAccountEntry = async (formData: any) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Account created successfully!'
      })
    }, 1000)
  })
}

const AccountSetupUi = ({ accounts }: AccountSetupUiProps) => {
  const { canCreate, canUpdate, canDelete } = usePermissions()
  const [isLoading, startTransition] = useTransition()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedParent, setSelectedParent] = useState<{ code: number; name: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAccounts, setExpandedAccounts] = useState<number[]>(getAllAccountCodes(accounts))

  const form = useForm({
    initialValues: {
      parent_account_code: '',
      name: '',
      is_parent: 'N',
      child_count: 0
    },
    validate: {
      parent_account_code: (value) => (value ? null : 'Parent account is required'),
      name: (value) => (value ? null : 'Account name is required'),
      is_parent: (value) => (value ? null : 'Please specify if this is a parent account'),
      child_count: (value, values) =>
        values.is_parent === 'Y' && value === 0 ? 'Child count is required for parent accounts' : null
    }
  })

  // Function to get all account codes for default expansion
  function getAllAccountCodes(accountData: AccountData): number[] {
    const codes: number[] = []

    const processAccounts = (accList: Account[]) => {
      accList.forEach((account) => {
        codes.push(account.account_code)
        if (account.children) {
          processAccounts(account.children)
        }
      })
    }

    processAccounts(accountData.assets)
    processAccounts(accountData.liabilities)
    processAccounts(accountData.expenditure)
    processAccounts(accountData.income)

    return codes
  }

  const handleAddAccount = (parentCode: number, parentName: string) => {
    setSelectedParent({ code: parentCode, name: parentName })
    form.setFieldValue('parent_account_code', parentCode.toString())
    open()
  }

  const toggleAccount = (accountCode: number) => {
    if (expandedAccounts.includes(accountCode)) {
      setExpandedAccounts(expandedAccounts.filter((code) => code !== accountCode))
    } else {
      setExpandedAccounts([...expandedAccounts, accountCode])
    }
  }

  /**
   * Handles the form submission.
   * Sends an API request to create a new account.
   */
  const submitHandler = (values: any) => {
    startTransition(async () => {
      try {
        const res: any = await addAccountInChartOfAccount(values)
        if (res.success) {
          showNotification(getSuccessMessage(res?.message))
          form.reset()
          close()
        } else {
          showNotification(getErrorMessage(res?.message))
        }
      } catch (error) {
        showNotification(getErrorMessage('Failed to create account'))
      }
    })
  }

  // Filter accounts based on search query
  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts

    const query = searchQuery.toLowerCase()

    const filterAccountList = (accList: Account[]): Account[] => {
      return accList
        .map((account) => ({ ...account }))
        .filter((account) => {
          const matches =
            account.account_name.toLowerCase().includes(query) || account.account_code.toString().includes(query)

          if (account.children) {
            account.children = filterAccountList(account.children)
            return matches || account.children.length > 0
          }

          return matches
        })
    }

    return {
      assets: filterAccountList(accounts.assets),
      liabilities: filterAccountList(accounts.liabilities),
      expenditure: filterAccountList(accounts.expenditure),
      income: filterAccountList(accounts.income)
    }
  }, [accounts, searchQuery])

  const renderAccountItem = (account: Account, level: number = 0) => {
    const hasChildren = account.children && account.children.length > 0
    const hasSubAccounts = account.sub_accounts && account.sub_accounts.length > 0
    const isParentAccount = account.type === 'parent'
    const isExpanded = expandedAccounts.includes(account.account_code)

    return (
      <Box key={account.account_code} ml={level * 12} mt={4}>
        <Group gap={4} justify="space-between">
          <Group gap={4}>
            {hasChildren || hasSubAccounts ? (
              <ActionIcon size="xs" variant="subtle" onClick={() => toggleAccount(account.account_code)}>
                {isExpanded ? <BiChevronDown size={12} /> : <BiChevronRight size={12} />}
              </ActionIcon>
            ) : (
              <Box ml={rem(16)}></Box>
            )}

            <ActionIcon size="xs" variant="transparent" color="gray">
              {isExpanded ? <BiFolderOpen size={12} /> : <BiFolder size={12} />}
            </ActionIcon>

            <Badge variant="light" color="blue" size="xs" radius="sm">
              {account.account_code}
            </Badge>

            <Text size="xs">{account.account_name}</Text>
          </Group>

          {isParentAccount && (
            <ActionIcon
              size="xs"
              variant="light"
              color="blue"
              onClick={() => handleAddAccount(account.account_code, account.account_name)}
              mr="xs"
            >
              <BiPlus size={12} />
            </ActionIcon>
          )}
        </Group>

        {isExpanded && (hasChildren || hasSubAccounts) && (
          <Box pl="md" mt={4}>
            {hasChildren && account.children?.map((child) => renderAccountItem(child, level + 1))}

            {hasSubAccounts && (
              <List withPadding spacing={2} size="xs" mt={4}>
                {account.sub_accounts?.map((sub) => (
                  <List.Item key={sub.key_code} style={{ listStyle: 'none' }}>
                    <Group gap={4}>
                      <Badge variant="light" color="gray" size="xs" radius="sm">
                        {sub.key_code}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {sub.details}
                      </Text>
                    </Group>
                  </List.Item>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>
    )
  }

  const renderAccountSection = (title: string, accounts: Account[], color: string) => {
    if (accounts.length === 0) return null

    return (
      <Grid.Col span={6}>
        <Paper shadow="xs" p="xs" withBorder>
          <Group justify="space-between" mb={4}>
            <Group gap={4}>
              <Title order={6} c={color}>
                {title}
              </Title>
              <Badge variant="filled" size="xs" radius="sm">
                {accounts.length}
              </Badge>
            </Group>
          </Group>

          <Box style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {accounts.map((account) => renderAccountItem(account))}
          </Box>
        </Paper>
      </Grid.Col>
    )
  }

  return (
    <Container fluid p="xs">
      <Group justify="space-between" mb="md">
        <Group gap={4}>
          <FiLayers size={18} />
          <div>
            <Title order={5}>General Accounting</Title>
            <Text c="dimmed" size="xs">
              Chart of Account Setup
            </Text>
          </div>
        </Group>

        <Input
          placeholder="Search by account name or code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSection={<BiSearch size={14} />}
          size="xs"
          style={{ width: '250px' }}
        />
      </Group>

      <Grid>
        {renderAccountSection('ASSETS', filteredAccounts.assets, 'blue')}
        {renderAccountSection('LIABILITIES', filteredAccounts.liabilities, 'red')}
        {renderAccountSection('EXPENDITURE', filteredAccounts.expenditure, 'orange')}
        {renderAccountSection('INCOME', filteredAccounts.income, 'green')}
      </Grid>

      <Modal opened={opened} onClose={close} title="Add New Account Head" centered size="sm">
        <Box>
          <form onSubmit={form.onSubmit(submitHandler)}>
            <TextInput label="Parent Account Code" value={selectedParent?.code || ''} disabled mb="xs" size="xs" />
            <TextInput label="Parent Account Name" value={selectedParent?.name || ''} disabled mb="xs" size="xs" />
            <TextInput
              label="New Account Name"
              placeholder="Enter account name"
              mb="xs"
              size="xs"
              {...form.getInputProps('name')}
            />
            <Select
              label="Is Parent?"
              data={[
                { value: 'N', label: 'No' },
                { value: 'Y', label: 'Yes' }
              ]}
              mb="xs"
              size="xs"
              {...form.getInputProps('is_parent')}
            />
            {form.values.is_parent === 'Y' && (
              <NumberInput
                label="Number of Children"
                min={0}
                mb="xs"
                size="xs"
                {...form.getInputProps('child_count')}
              />
            )}
            <Group justify="flex-end" mt="xs">
              <Button variant="outline" onClick={close} size="xs">
                Cancel
              </Button>
              {
                canCreate ? <Button type="submit" leftSection={<BiSave size={14} />} loading={isLoading} size="xs">
                  Create Account
                </Button> : null
              }

            </Group>
          </form>
        </Box>
      </Modal>
    </Container>
  )
}

export default AccountSetupUi
