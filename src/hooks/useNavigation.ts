import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const useNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const createQueryString = useCallback(
    (params: { [key: string]: string }) => {
      const newSearchParams = new URLSearchParams(searchParams)
      Object.entries(params).forEach(([key, value]) => {
        if (value) newSearchParams.set(key, value)
        else newSearchParams.delete(key)
      })
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const navigate = (params: { [key: string]: string }) => {
    router.push(pathname + '?' + createQueryString(params))
  }

  return { navigate }
}

export default useNavigation