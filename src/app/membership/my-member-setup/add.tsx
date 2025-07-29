import { createServiceArea } from '@actions/settings/service-area-config'
import { Box, Button, Grid, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { serviceAreaValidationSchema } from '@schemas/settings.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiSave } from 'react-icons/bi'

const AddModal = ({ locations }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps } = useForm({
    validate: yupResolver(serviceAreaValidationSchema),
    initialValues: {
      // Basic Info
      member_id: '',
      title: '',
      name: '',
      contact: '',
      father: '',
      mother: '',
      spouse: '',
      dob: '',
      religion: '',
      blood: '',
      national_id: '',
      address: '',
      profession: '',
      location: '',

      // Nominee Info
      nom_name: '',
      nom_relation: '',
      nom_contact: '',
      nom_nid: '',
      nom_address: ''
    }
  })

  const submitHandler = (formData: any) =>
    startTransition(async () => {
      const res = await createServiceArea(formData)
      if (res.success) {
        showNotification(getSuccessMessage(res?.message))
        closeAllModals()
      } else {
        showNotification(getErrorMessage(res?.message))
      }
    })

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Add Member
      </Title>

      {/* Basic Information Section */}
      <Box mb="xl" p="xs" style={{ border: '1px solid #dee2e6', borderRadius: '5px' }}>
        <Title order={5} mb="xs">Basic Information</Title>

        <Grid>
          <Grid.Col span={3}>
            <TextInput
              label="Member ID"
              size="xs"
              withAsterisk
              {...getInputProps('member_id')}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              label="Title"
              size="xs"
              data={[
                { value: 'Mr', label: 'Mr.' },
                { value: 'Mrs', label: 'Mrs.' },
                { value: 'Ms', label: 'Ms.' }
              ]}
              withAsterisk
              {...getInputProps('title')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Full Name"
              size="xs"
              withAsterisk
              {...getInputProps('name')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Contact No"
              size="xs"
              withAsterisk
              {...getInputProps('contact')}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="Father's Name"
              size="xs"
              withAsterisk
              {...getInputProps('father')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Mother's Name"
              size="xs"
              withAsterisk
              {...getInputProps('mother')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Spouse Name"
              size="xs"
              {...getInputProps('spouse')}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <TextInput
              label="Date of Birth"
              size="xs"
              type="date"
              withAsterisk
              {...getInputProps('dob')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Religion"
              size="xs"
              data={[
                { value: 'islam', label: 'Islam' },
                { value: 'hindu', label: 'Hindu' },
                { value: 'christian', label: 'Christian' },
                { value: 'buddhist', label: 'Buddhist' }
              ]}
              withAsterisk
              {...getInputProps('religion')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Blood Group"
              size="xs"
              data={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                // Add other blood groups
              ]}
              {...getInputProps('blood')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="National ID/Birth Cert."
              size="xs"
              withAsterisk
              {...getInputProps('national_id')}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Address"
              size="xs"
              withAsterisk
              {...getInputProps('address')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Profession"
              size="xs"
              data={[
                { value: 'business', label: 'Business' },
                { value: 'service', label: 'Service' },
                // Add other professions
              ]}
              {...getInputProps('profession')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Location Area"
              size="xs"
              data={[
                { value: 'spouse', label: 'Spouse' },
                { value: 'father', label: 'Father' },
                { value: 'mother', label: 'Mother' },
                { value: 'son', label: 'Son' },
                { value: 'daughter', label: 'Daughter' }
              ]}
              {...getInputProps('location')}
            />
          </Grid.Col>
        </Grid>
      </Box>

      {/* Nominee Information Section */}
      <Box mb="xl" p="xs" style={{ border: '1px solid #dee2e6', borderRadius: '5px' }}>
        <Title order={5} mb="xs">Nominee Information</Title>

        <Grid>
          <Grid.Col span={4}>
            <TextInput
              label="Nominee Name"
              size="xs"
              withAsterisk
              {...getInputProps('nom_name')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Relationship"
              size="xs"
              data={[
                { value: 'spouse', label: 'Spouse' },
                { value: 'father', label: 'Father' },
                { value: 'mother', label: 'Mother' },
                { value: 'son', label: 'Son' },
                { value: 'daughter', label: 'Daughter' }
              ]}
              withAsterisk
              {...getInputProps('nom_relation')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Nominee Contact"
              size="xs"
              withAsterisk
              {...getInputProps('nom_contact')}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Nominee NID/Birth Cert."
              size="xs"
              {...getInputProps('nom_nid')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Nominee Address"
              size="xs"
              {...getInputProps('nom_address')}
            />
          </Grid.Col>
        </Grid>
      </Box>

      <Button type="submit" leftSection={<BiSave />} loading={isLoading} mt="md">
        Submit
      </Button>
    </form>
  )
}

export default AddModal