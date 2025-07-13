import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { Lora, Work_Sans } from 'next/font/google'
import { ReactNode } from 'react'

import Structure from '@components/layout/main'
import { theme } from '@config/theme'
import '@mantine/charts/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import './globals.css'

const work_sans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap'
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://karzbook.com'),
  title: {
    default: 'Karzbook - Microfinance Management Solution',
    template: '%s - Karzbook Microfinance'
  },
  description:
    "Streamline your microfinance operations with Karzbook. This comprehensive application provides a centralized platform for managing loans, repayments, and customer accounts. Track financial transactions, monitor loan performance, and enhance your microfinance services with powerful analytics and reporting tools.",
  authors: [{ name: 'Md.Rabiul Hasan', url: 'https://github.com/md-rabiul-hasan' }],
  publisher: 'Hello Software Solutions',
  keywords: [
    'microfinance',
    'loan management',
    'financial inclusion'
  ]
};

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => (
  <html lang="en" className={clsx(work_sans.variable, lora.variable)} suppressHydrationWarning>
    <head>
      <ColorSchemeScript defaultColorScheme="auto" />
    </head>

    <body>
      <MantineProvider theme={theme} defaultColorScheme="auto" classNamesPrefix="karzbook">
        <NavigationProgress />
        <Notifications />

        <Structure>{children}</Structure>
      </MantineProvider>
    </body>
  </html>
)

export default RootLayout
