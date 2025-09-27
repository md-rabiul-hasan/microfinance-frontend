import { fetchMenuList } from '@actions/common-config';
import { ReactNode } from 'react';
import { AiOutlineDashboard as DashboardIcon } from 'react-icons/ai';
import { BiDonateBlood } from 'react-icons/bi';
import { CiSettings } from 'react-icons/ci';
import { FaRegCircle } from "react-icons/fa";
import { FiUsers } from 'react-icons/fi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { LiaDonateSolid } from 'react-icons/lia';
import { MdOutlineAccountBalance, MdOutlineMenuBook, MdOutlineTextsms } from 'react-icons/md';
import { PiHandWithdrawLight } from 'react-icons/pi';
import { TbReportSearch } from 'react-icons/tb';

export type MenuItem = {
  link: string
  label: string
  icon?: ReactNode
}

export type MenuItemWithoutIcon = {
  link: string
  label: string
  icon?: ReactNode // Add icon support for submenu items
}

export type MenuWithLinks = {
  label: string
  icon?: ReactNode
  links: (MenuItemWithoutIcon | MenuWithLinks)[]
}

export type MenuItems = MenuItem | MenuWithLinks

// 🔹 Map icon names from API → actual React icons
const iconMap: Record<string, ReactNode> = {
  dashboard: <DashboardIcon />,
  settings: <CiSettings />,
  membership: <HiOutlineUserGroup />,
  deposit: <LiaDonateSolid />,
  withdrawal: <PiHandWithdrawLight />,
  loan: <BiDonateBlood />,
  basicAccounting: <MdOutlineAccountBalance />,
  profit: <GiTakeMyMoney />,
  users: <FiUsers />,
  accounting: <MdOutlineMenuBook />,
  report: <TbReportSearch />,
  sms: <MdOutlineTextsms />,
  subicon: <FaRegCircle size={10} />,
}

// 🔹 Fetch + transform menu from API
export const getMenuList = async (): Promise<MenuItems[]> => {
  try {
    const data = await fetchMenuList()

    // Transform menu items with proper icon mapping
    const menu = data.map((item: any) => ({
      ...item,
      icon: item.icon ? iconMap[item.icon] : undefined,
      links: item.links
        ? item.links.map((sub: any) => ({
          ...sub,
          icon: sub.icon ? iconMap[sub.icon] : <FaRegCircle size={10} /> // Use mapped icon or default
        }))
        : undefined
    }))
    return menu
  } catch (err) {
    return []
  }
}

// 🔹 Helpers
export const isActiveLink = (path: string, link: string = ''): boolean => {
  if (link === '/') return path === link
  const nextChar = path[link.length]
  return path.startsWith(link) && (!nextChar || nextChar === '/')
}

export const isMenuWithLinks = (item: MenuItems): item is MenuWithLinks =>
  (item as MenuWithLinks).links !== undefined

export const hasNestedLinks = (item: MenuItemWithoutIcon | MenuWithLinks): item is MenuWithLinks =>
  (item as MenuWithLinks).links !== undefined