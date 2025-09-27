import { NavLink, ScrollArea } from '@mantine/core'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getMenuList, hasNestedLinks, isActiveLink, isMenuWithLinks, MenuItems } from './list'
import classes from './styles.module.css'

const AppNavbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menus, setMenus] = useState<MenuItems[]>([])

  useEffect(() => {
    const fetchMenus = async () => {
      const data = await getMenuList()
      setMenus(data)
    }
    fetchMenus()
  }, [session?.user.user_type])

  const renderMenuItems = (items: any[], level = 0) => {
    return items.map((item, index) => {
      if (isMenuWithLinks(item) || hasNestedLinks(item)) {
        const hasActiveChild = item.links.some((link: any) =>
          hasNestedLinks(link)
            ? link.links.some((nestedLink: any) => isActiveLink(pathname, nestedLink.link))
            : isActiveLink(pathname, link.link)
        )

        return (
          <NavLink
            key={index}
            label={item.label}
            leftSection={level === 0 ? item.icon : item.icon} // Show icon at all levels
            className={clsx(classes.link, hasActiveChild && classes.activeList, level > 0 && classes.nested)}
            data-level={level}
            defaultOpened={hasActiveChild}
            childrenOffset={0}
          >
            {renderMenuItems(item.links, level + 1)}
          </NavLink>
        )
      } else {
        return (
          <NavLink
            component={Link}
            href={item.link}
            className={clsx(classes.link, level > 0 && classes.nested)}
            data-level={level}
            label={item.label}
            leftSection={item.icon} // Always show icon if available
            active={isActiveLink(pathname, item.link)}
            key={index}
          />
        )
      }
    })
  }

  return (
    <ScrollArea className={classes.root} p="xs">
      {renderMenuItems(menus)}
    </ScrollArea>
  )
}

export default AppNavbar