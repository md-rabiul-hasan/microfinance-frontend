import { ReactNode } from 'react'
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai'
import { BiDonateBlood } from 'react-icons/bi'
import { CiSettings } from 'react-icons/ci'
import { FiUsers } from 'react-icons/fi'
import { GiTakeMyMoney } from "react-icons/gi"
import { HiOutlineUserGroup } from 'react-icons/hi'
import { LiaDonateSolid } from 'react-icons/lia'
import { MdOutlineAccountBalance } from 'react-icons/md'
import { PiHandWithdrawLight } from 'react-icons/pi'

type MenuItem = {
  link: string
  label: string
  icon: ReactNode
}

type MenuItemWithoutIcon = {
  link: string
  label: string
}

type MenuWithLinks = {
  label: string
  icon: ReactNode
  links: MenuItemWithoutIcon[]
}

type MenuItems = MenuItem | MenuWithLinks

export const menuItems = (roles: string[]) => [
  { link: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  {
    label: 'Settings',
    icon: <CiSettings />,
    links: [
      { link: '/settings/service-area-setup', label: 'Service Area Setup' },
      { link: '/settings/fiscal-year-setup', label: 'Fiscal Year Setup' },
      { link: '/settings/transaction-date-setup', label: 'Transaction Date Setup' },
      { link: '/settings/company-setup', label: 'Company Setup' },
      { link: '/settings/employee-setup', label: 'Employee Setup' },
      { link: '/settings/branch-setup', label: 'Branch Setup' },
      { link: '/settings/project-setup', label: 'Project Setup' },
      { link: '/settings/external-saving-account-setup', label: 'External Saving A/C Setup' },
      { link: '/settings/bank-account-setup', label: 'Bank Account Setup' }
    ]
  },
  {
    label: 'Membership',
    icon: <HiOutlineUserGroup />,
    links: [
      { link: '/membership/my-member-setup/add', label: 'Add Member' },
      { link: '/membership/my-member-setup', label: 'Update Member' }
    ]
  },
  {
    label: 'Deposit',
    icon: <LiaDonateSolid />,
    links: [
      { link: '/deposit/regular-deposit', label: 'Regular Deposit' },
      { link: '/deposit/irregular-deposit', label: 'Irregular Deposit' },
      { link: '/deposit/fixed-deposit', label: 'Fixed Deposit' }
    ]
  },
  {
    label: 'Withdrawal',
    icon: <PiHandWithdrawLight />,
    links: [{ link: '/withdrawal/withdrawal-amount', label: 'Withdraw Amount' }]
  },
  {
    label: 'Loan Processing',
    icon: <BiDonateBlood />,
    links: [
      { link: '/loan-processing/karz-e-hasanah', label: 'Karz-E-Hasanah' },
      { link: '/loan-processing/purchase-item', label: 'Purchase Item' },
      { link: '/loan-processing/sale-mudaraba', label: 'Sale Mudaraba' },
      { link: '/loan-processing/loan-collection', label: 'Loan Collection' },
      { link: '/loan-processing/delete-loan', label: 'Delete Loan' },
      { link: '/loan-processing/delete-loan-auth', label: 'Delete Loan Auth' }
    ]
  },
  {
    label: 'General Accounting',
    icon: <MdOutlineAccountBalance />,
    links: [
      { link: '/general-accounting/journal-entry', label: 'Journal Entry' },
      { link: '/general-accounting/cash-voucher', label: 'Cash Voucher' },
      { link: '/general-accounting/profit-reserve', label: 'Profit Reserve' },
      { link: '/general-accounting/account-setup', label: 'Account Setup' }
    ]
  },
  {
    label: 'Basic Accounting',
    icon: <GiTakeMyMoney />,
    links: [
      { link: '/basic-accounting/banking-transaction', label: 'Banking Transaction' },
      { link: '/basic-accounting/external-saving-account-transaction', label: 'External Saving A/C Txn' },
      { link: '/basic-accounting/different-project-transaction', label: 'Different Project Txn' },
    ]
  },
  {
    label: 'User & Security',
    icon: <FiUsers />,
    links: [
      { link: '/user-and-security/new-user', label: 'New User' },
      { link: '/user-and-security/user-permission', label: 'User Permission' }
    ]
  }
]

export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link

  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks => (item as MenuWithLinks).links !== undefined
