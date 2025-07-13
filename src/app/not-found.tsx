'use client'

import { Button, Container, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { FaHome as HomeIcon } from 'react-icons/fa'

const NotFound = () => (
  <Container mih="calc(100vh - 12rem)" style={{ display: 'flex', alignItems: 'center' }}>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 10, sm: 'xl' }}>
      <Stack justify="center" gap="md">
        <Title size={30}>Page Not Found</Title>

        <Text c="dimmed" ta="justify">
          Unfortunately, the page you are trying to open does not exist You may have mistyped the address or The page
          has been moved to another URL.
        </Text>

        <Group>
          <Button component={Link} href="/" leftSection={<HomeIcon />}>
            Back to Homepage
          </Button>
        </Group>
      </Stack>

      <Image src="/images/not-found.svg" alt="404" />
    </SimpleGrid>
  </Container>
)

export default NotFound
