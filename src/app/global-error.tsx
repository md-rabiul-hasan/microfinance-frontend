'use client'

import ErrorMsg from '@components/common/error-msg'
import { Button, Container } from '@mantine/core'
import { BiReset as ResetIcon } from 'react-icons/bi'

type Props = {
  error: Error
  reset: () => void
}

const GlobalError = ({ error, reset }: Props) => (
  <html>
    <body>
      <Container>
        <ErrorMsg error={error} />

        <Button variant="outline" onClick={() => reset()} leftSection={<ResetIcon size="1.05rem" />}>
          Try again
        </Button>
      </Container>
    </body>
  </html>
)

export default GlobalError
