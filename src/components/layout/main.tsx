'use client'

import { ModalsProvider } from '@mantine/modals'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import Shell from './shell'

type Props = {
  children: ReactNode
}

const Structure = ({ children }: Props) => (
  <SessionProvider>
    <ModalsProvider>
      <Shell>{children}</Shell>
    </ModalsProvider>
  </SessionProvider>
)

export default Structure
