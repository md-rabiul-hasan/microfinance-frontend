'use client'

import Link from 'next/link'
import { Button, Container, Group } from '@mantine/core'
import { BiReset as ResetIcon } from 'react-icons/bi'
import { TiArrowBack as BackIcon } from 'react-icons/ti'

import ErrorMsg from '@components/common/error-msg'

type Props = {
  error: Error
  reset: () => void
}

const Error = ({ error, reset }: Props) => (
  <Container>
    <ErrorMsg error={error} />

    <Group mt="md">
      <Button variant="gradient" component={Link} href="/" leftSection={<BackIcon size="1.05rem" />}>
        Back to Homepage
      </Button>

      <Button variant="outline" onClick={() => reset()} leftSection={<ResetIcon size="1.05rem" />}>
        Try again
      </Button>
    </Group>
  </Container>
)

export default Error
