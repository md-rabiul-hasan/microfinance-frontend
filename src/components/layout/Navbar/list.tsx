import { ReactNode } from 'react';
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai';
import { FaProductHunt } from "react-icons/fa";
import { TbCoinTakaFilled } from "react-icons/tb";

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
    label: 'Miscellaneous Charges',
    icon: <TbCoinTakaFilled />,
    links: [
      { link: '/charges/entry', label: 'Charge Entry' },
      { link: '/charges/authorize', label: 'Charge Authorize' },
    ]
  },
  {
    label: 'Product',
    icon: <FaProductHunt />,
    links: [
      { link: '/products/list', label: 'List' },
    ]
  },
]

export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link

  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks => (item as MenuWithLinks).links !== undefined
