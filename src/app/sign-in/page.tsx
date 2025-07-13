import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import { authOptions } from '@utils/auth-options'
import SignInUI from './ui'

export const metadata: Metadata = {
	title: 'Sign In'
}

type SearchParams = Promise<{ callbackUrl: string }>

const SignIn = async (props: { searchParams: SearchParams }) => {
	const searchParams = await props.searchParams
	const session = await getServerSession(authOptions)
	if (session) redirect(searchParams?.callbackUrl ? searchParams.callbackUrl : '/')

	return <SignInUI />
}

export default SignIn
