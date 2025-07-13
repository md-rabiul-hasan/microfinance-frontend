'use client'

import { Group, Loader, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'

const LoadingComponent = () => {
  const { status } = useSession()

  return (
    <Group
      justify="center"
      h={status !== 'authenticated' ? '100dvh' : 'calc(100dvh - var(--mantine-header-height, 0px) - 120px)'}
      style={{ flexDirection: 'column' }}
    >
      <Loader size="lg" />

      <Text>Fetching Data...</Text>
    </Group>
  )
}

export default LoadingComponent
