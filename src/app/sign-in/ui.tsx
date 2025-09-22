'use client'

import { signIn, SignInResponse } from 'next-auth/react'
import { useState } from 'react'

import { Anchor, Button, Container, Group, Image, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

import { BiErrorCircle as ErrorIcon } from 'react-icons/bi'
import { CgPassword as PasswordIcon, CgLogIn as SignInIcon } from 'react-icons/cg'

import { signInSchema } from '@schemas/auth.schema'
import { SignInValues } from '@types'
import { setSessionTransactionDate } from '@utils/transaction-date'
import { FaUserTie } from "react-icons/fa"
import classes from './styles.module.css'

const SignInUI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { refresh } = useRouter()

  const { onSubmit, getInputProps } = useForm<SignInValues>({
    validate: yupResolver(signInSchema),
    initialValues: {
      username: undefined,
      password: ''
    }
  })

  const submitHandler = async (values: SignInValues) => {
    setIsLoading(true)

    const response: SignInResponse | undefined = await signIn('credentials', { ...values, redirect: false })


    if (response?.error) {
      showNotification({
        title: response ? 'Unauthorized' : 'Unexpected Error',
        message: response ? response.error : 'An unexpected error occurred. Please try again.',
        icon: <ErrorIcon />,
        color: 'red'
      })

      setIsLoading(false)
      return
    }

    // Set transaction date immediately after successful login
    setSessionTransactionDate(new Date())
    refresh()
    setIsLoading(false)
  }

  return (
    <div className={classes.root}>

      <Container size="xs" className={classes.container}>
        <Paper p={28} shadow="sm" radius="md" className={classes.paper}>
          <Group justify="center" gap="xs" mb="xl">
            <Image src="/images/logo.png" alt="ConnectPro" h={40} w="auto" />
            {/* <Title order={1} color="dark">KARZBOOK</Title> */}
          </Group>

          <form onSubmit={onSubmit(submitHandler)}>
            <Title size={25} mb={4} tt="uppercase" c="gray.1">
              Sign In
            </Title>

            <Text size="sm" mb="md" c="gray.3">
              Welcome back
            </Text>

            <TextInput
              label="Username"
              c="gray.3"
              leftSectionPointerEvents="none"
              leftSection={<FaUserTie />} // Use an appropriate icon for username
              placeholder="Enter your username"
              {...getInputProps('username')}
            />



            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              leftSection={<PasswordIcon />}
              c="gray.3"
              withAsterisk
              mt="xs"
              {...getInputProps('password')}
            />

            <Button type="submit" leftSection={<SignInIcon />} mt="md" loading={isLoading} fullWidth>
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>

      <Text c="gray.2" size="xs" ta="center" className={classes.credits}>
        Designed & Developed by{' '}
        <Anchor c="gray.1" href="https://github.com/md-rabiul-hasan" target="_blank">
          Md. Rabiul Hasan
        </Anchor>
      </Text>
    </div>
  )
}

export default SignInUI
