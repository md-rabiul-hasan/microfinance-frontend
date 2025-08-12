import { ReactNode } from 'react'
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai'
import { BiDonateBlood } from "react-icons/bi"
import { CiSettings } from 'react-icons/ci'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { LiaDonateSolid } from 'react-icons/lia'
import { PiHandWithdrawLight } from "react-icons/pi"

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
      { link: '/deposit/fixed-deposit', label: 'Fixed Deposit' },
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
      { link: '/loan-processing/karz-e-hasanah', label: 'Karz-E-Hasanah' }
    ]
  },
]

export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link

  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks => (item as MenuWithLinks).links !== undefined
