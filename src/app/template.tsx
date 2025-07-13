'use client'

import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { motion } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

const Template = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    nprogress.complete()

    return () => {
      nprogress.start()
    }
  }, [pathname, searchParams])

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <NavigationProgress />
      {children}
    </motion.div>
  )
}

export default Template
