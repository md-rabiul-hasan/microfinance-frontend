import { ReactNode } from 'react';
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai';
import { CiSettings } from 'react-icons/ci';
import { FaUsers } from "react-icons/fa6";

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
    icon: <FaUsers />,
    links: [
      { link: '/membership/my-member-setup', label: 'My Member' },
    ]
  }
]

export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link

  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks => (item as MenuWithLinks).links !== undefined
