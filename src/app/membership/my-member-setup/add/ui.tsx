'use client'

import { createServiceArea } from '@actions/settings/service-area-config'
import { Button, Grid, Paper, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { serviceAreaValidationSchema } from '@schemas/settings.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { BsGenderTrans } from "react-icons/bs"
import { CgDetailsMore } from "react-icons/cg"
import { CiMobile3, CiSearch } from "react-icons/ci"
import { FaRegUser } from "react-icons/fa"
import { ImManWoman } from "react-icons/im"
import { IoCalendarOutline, IoLocationOutline, IoManOutline, IoWomanOutline } from "react-icons/io5"
import { LiaIdCardAltSolid } from "react-icons/lia"
import { MdOutlineBloodtype, MdOutlineElderlyWoman, MdOutlineEmail, MdOutlineWorkOutline } from "react-icons/md"
import { PiHandsPrayingLight } from "react-icons/pi"
import { RiIdCardLine } from "react-icons/ri"
import { TbCirclesRelation } from "react-icons/tb"

const AddMemberUi = ({ religions, bloodGroups, professions, addressZones }: any) => {
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
      <Paper shadow="xs" mb="xs" p="md">
        <Title order={5} mb="xs">Basic Information</Title>

        <Grid>
          <Grid.Col span={3}>
            <TextInput
              label="Member ID"
              size="xs"
              withAsterisk
              {...getInputProps('member_id')}
              leftSection={<LiaIdCardAltSolid />}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              label="Title"
              size="xs"
              data={[
                { value: 'M', label: 'Mr.' },
                { value: 'F', label: 'Ms.' }
              ]}
              withAsterisk
              {...getInputProps('gender')}
              leftSection={<BsGenderTrans />}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Full Name"
              size="xs"
              withAsterisk
              {...getInputProps('name')}
              leftSection={<FaRegUser />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Contact No"
              size="xs"
              withAsterisk
              {...getInputProps('contact')}
              leftSection={<CiMobile3 />}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <TextInput
              label="Email"
              size="xs"
              {...getInputProps('email')}
              leftSection={<MdOutlineEmail />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Father's Name"
              size="xs"
              withAsterisk
              {...getInputProps('father')}
              leftSection={<IoManOutline />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Mother's Name"
              size="xs"
              withAsterisk
              {...getInputProps('mother')}
              leftSection={<IoWomanOutline />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Spouse's Name (if any)"
              size="xs"
              {...getInputProps('spouse')}
              leftSection={<ImManWoman />}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <TextInput
              label="Date of Birth"
              size="xs"
              type="date"
              withAsterisk
              {...getInputProps('dob')}
              leftSection={<IoCalendarOutline />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Religion"
              size="xs"
              data={religions.map((data: any) => ({
                value: String(data.religionCode),
                label: `${data.religionName}`
              }))}
              searchable
              withAsterisk
              {...getInputProps('religion')}
              leftSection={<PiHandsPrayingLight />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Blood Group"
              size="xs"
              data={bloodGroups.map((data: any) => ({
                value: String(data.bloodCode),
                label: `${data.grpName}`
              }))}
              searchable
              {...getInputProps('blood')}
              leftSection={<MdOutlineBloodtype />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="National ID/Birth Cert."
              size="xs"
              withAsterisk
              {...getInputProps('national_id')}
              leftSection={<RiIdCardLine />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Address"
              size="xs"
              withAsterisk
              {...getInputProps('address_det')}
              leftSection={<IoLocationOutline />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Profession"
              size="xs"
              data={professions.map((data: any) => ({
                value: String(data.keyCode),
                label: `${data.name}`
              }))}
              searchable
              withAsterisk
              {...getInputProps('profession')}
              leftSection={<MdOutlineWorkOutline />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Location Area"
              size="xs"
              data={addressZones.map((data: any) => ({
                value: String(data.zoneCode),
                label: `${data.zoneName}`
              }))}
              searchable
              {...getInputProps('address_zoneCode')}
              leftSection={<IoLocationOutline />}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Nominee Information Section */}
      <Paper shadow="xs" mb="xs" p="md">
        <Title order={5} mb="xs">Nominee Information</Title>

        <Grid>
          <Grid.Col span={3}>
            <TextInput
              label="Nominee Name"
              size="xs"
              withAsterisk
              {...getInputProps('nom_name')}
              leftSection={<MdOutlineElderlyWoman />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Relationship"
              size="xs"
              data={[
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Father', label: 'Father' },
                { value: 'Mother', label: 'Mother' },
                { value: 'Son', label: 'Son' },
                { value: 'Daughter', label: 'Daughter' },
                { value: 'Sister', label: 'Sister' },
                { value: 'Brother', label: 'Brother' },
                { value: 'Uncle', label: 'Uncle' },
                { value: 'Maternal Uncle', label: 'Maternal Uncle' },
                { value: 'Grand Father', label: 'Grand Father' },
                { value: 'Grand Mother', label: 'Grand Mother' },
                { value: 'Cousine', label: 'Cousine' },
                { value: 'Other', label: 'Other' }
              ]}
              searchable
              withAsterisk
              {...getInputProps('nom_relation')}
              leftSection={<TbCirclesRelation />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Contact No"
              size="xs"
              withAsterisk
              {...getInputProps('contact')}
              leftSection={<CiMobile3 />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="National ID/ Birth Certificate of Nominee"
              size="xs"
              withAsterisk
              {...getInputProps('nom_nid_bc')}
              leftSection={<RiIdCardLine />}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <Select
              label="Introducer Type"
              size="xs"
              data={[
                { value: 'M', label: 'Member' },
                { value: 'O', label: 'Non Member' },
              ]}
              withAsterisk
              {...getInputProps('int_type')}
              leftSection={<CiSearch />}
            />
          </Grid.Col>

          {/* <Grid.Col span={4}>
            <Select
              label="Introducer ID"
              size="xs"
              display="none"
              data={[
                { value: 'spouse', label: 'Spouse' },
                { value: 'father', label: 'Father' },
                { value: 'mother', label: 'Mother' },
                { value: 'son', label: 'Son' },
                { value: 'daughter', label: 'Daughter' }
              ]}
              withAsterisk
              {...getInputProps('int_id')}
            />
          </Grid.Col> */}


          <Grid.Col span={6}>
            <TextInput
              label="Details of Introducer"
              size="xs"
              {...getInputProps('int_details')}
              leftSection={<CgDetailsMore />}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              label="Membership Date"
              size="xs"
              {...getInputProps('mem_date')}
              leftSection={<IoCalendarOutline />}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <Button type="submit" leftSection={<BiSave />} loading={isLoading} mt="md">
        Submit
      </Button>
    </form>
  )
}

export default AddMemberUi