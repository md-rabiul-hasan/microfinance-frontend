import {
  ActionIcon,
  Avatar,
  Group,
  Image,
  Menu,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BsMoon as DarkIcon, BsSunFill as LightIcon } from 'react-icons/bs'
import { FiHelpCircle as HelpIcon } from 'react-icons/fi'
import { IoIosArrowDown as DownArrow } from 'react-icons/io'
import { MdLogout as LogoutIcon } from 'react-icons/md'

const AppHeader = () => {
  const { status, data: session } = useSession()
  console.log(session);
  const pathname = usePathname()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const { setColorScheme } = useMantineColorScheme()

  return (
    <Group justify="space-between" align="center" px="md" h="100%">
      <Link href="/">
        <Image
          src={`/images/logo${computedColorScheme === 'light' ? '' : '-white'}.png`}
          alt=""
          width="auto"
          height={32}
        />
      </Link>

      <Group justify="space-between" gap="xs">
        <ActionIcon variant={pathname === '/help' ? 'gradient' : 'light'} component={Link} href="/help">
          <HelpIcon />
        </ActionIcon>

        <ActionIcon
          variant="light"
          aria-label="color-theme"
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        >
          {computedColorScheme === 'light' ? <DarkIcon /> : <LightIcon />}
        </ActionIcon>

        <Menu shadow="md" width={200} position="top-end" withArrow>
          <Menu.Target>
            {status === 'authenticated' ? (
              <Group className="profile-menu" gap="xs">
                <Avatar src={session.user.avatar} alt={session.user.fullname} />

                <div>
                  <Text>{session.user.full_name}</Text>
                  <Text c="dimmed" size="xs">
                    {`${session.user.branch_name} (${session.user.role})`}
                  </Text>
                </div>

                <DownArrow size={10} />
              </Group>
            ) : (
              <Group gap="xs">
                <Skeleton height={50} circle mb="xl" />

                <div>
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </div>
              </Group>
            )}
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => signOut()} leftSection={<LogoutIcon />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}

export default AppHeader
