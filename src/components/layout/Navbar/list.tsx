import { ReactNode } from 'react'
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai'
import { CiSettings } from 'react-icons/ci'

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
      { link: '/settings/employee-setup', label: 'Employee Setup' },
      { link: '/settings/branch-setup', label: 'Branch Setup' }
    ]
  }
]

export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link

  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks => (item as MenuWithLinks).links !== undefined
