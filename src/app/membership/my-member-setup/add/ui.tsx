'use client'

import { createMember, updateMember } from '@actions/membership/my-member-config'
import { createServiceArea } from '@actions/settings/service-area-config'
import { Box, Button, Flex, Grid, Paper, Select, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { myMemberSetupValidationSchema } from '@schemas/my-member.schema'
import { serviceAreaValidationSchema } from '@schemas/settings.schema'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import Image from 'next/image'
import { useTransition } from 'react'
import { BiSave } from 'react-icons/bi'
import { BsGenderTrans } from 'react-icons/bs'
import { CgDetailsMore } from 'react-icons/cg'
import { CiMobile3, CiSearch } from 'react-icons/ci'
import { FaRegUser } from 'react-icons/fa'
import { ImManWoman } from 'react-icons/im'
import { IoCalendarOutline, IoLocationOutline, IoManOutline, IoWomanOutline } from 'react-icons/io5'
import { LiaIdCardAltSolid } from 'react-icons/lia'
import { MdOutlineBloodtype, MdOutlineElderlyWoman, MdOutlineEmail, MdOutlineWorkOutline } from 'react-icons/md'
import { PiHandsPrayingLight } from 'react-icons/pi'
import { RiIdCardLine } from 'react-icons/ri'
import { TbCirclesRelation } from 'react-icons/tb'

const AddMemberUi = ({ religions, bloodGroups, professions, addressZones, members, details }: any) => {
  const [isLoading, startTransition] = useTransition()

  const { onSubmit, getInputProps, values } = useForm({
    validate: yupResolver(myMemberSetupValidationSchema),
    initialValues: {
      // Basic Info
      member_id: details?.member_id || '',
      gender: details?.gender || '',
      name: details?.name || '',
      contact: details?.contact || '',
      email: details?.email || '',
      father: details?.father || '',
      mother: details?.mother || '',
      spouse: details?.spouse || '',
      dob: details?.dob || '',
      religion: details?.religion != null ? String(details.religion) : '',
      blood: details?.blood != null ? String(details.blood) : '',
      national_id: details?.national_id || '',
      address_det: details?.address_det || '',
      profession: details?.profession != null ? String(details.profession) : '',
      address_zoneCode: details?.address_zoneCode != null ? String(details.address_zoneCode) : '',

      // Nominee Info
      nom_name: details?.nom_name || '',
      nom_relation: details?.nom_relation || '',
      nom_nid_bc: details?.nom_nid_bc || '',
      nomContact: details?.nomContact || '',
      int_type: details?.int_type || '',
      int_id: details?.int_id?.toString() || '',
      int_details: details?.int_details || '',
      mem_date: details?.mem_date || ''
    }
  })

  const submitHandler = (formData: any) =>
    startTransition(async () => {
      let res = null
      if (details) {
        res = await updateMember(details.memberKeyCode, formData)
      } else {
        res = await createMember(formData)
      }

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
        Member Information
      </Title>

      {/* Basic Information Section */}
      <Paper shadow="xs" mb="xs" p="md">
        <Title order={5} mb="xs">
          Basic Information
        </Title>

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
              withAsterisk
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
              withAsterisk
              {...getInputProps('address_zoneCode')}
              leftSection={<IoLocationOutline />}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Nominee Information Section */}
      <Paper shadow="xs" mb="xs" p="md">
        <Title order={5} mb="xs">
          Nominee Information
        </Title>

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
              {...getInputProps('nomContact')}
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
                { value: 'O', label: 'Non Member' }
              ]}
              withAsterisk
              {...getInputProps('int_type')}
              leftSection={<CiSearch />}
            />
          </Grid.Col>

          {values.int_type === 'M' && (
            <Grid.Col span={4}>
              <Select
                label="Introducer ID"
                size="xs"
                data={members.map((data: any) => ({
                  value: String(data.memberKeyCode),
                  label: `${data.member_id} - ${data.name}`
                }))}
                searchable
                withAsterisk
                {...getInputProps('int_id')}
              />
            </Grid.Col>
          )}

          {values.int_type === 'O' && (
            <Grid.Col span={6}>
              <TextInput
                label="Details of Introducer"
                size="xs"
                withAsterisk
                {...getInputProps('int_details')}
                leftSection={<CgDetailsMore />}
              />
            </Grid.Col>
          )}

          <Grid.Col span={2}>
            <TextInput
              label="Membership Date"
              size="xs"
              {...getInputProps('mem_date')}
              type="date"
              withAsterisk
              leftSection={<IoCalendarOutline />}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <Button type="submit" leftSection={<BiSave />} loading={isLoading} mt="md">
        Submit
      </Button>
      {details?.profile_image?.insert_key || details?.signature_image?.insert_key ? (
        <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
          {/* Profile Picture Section */}
          {details?.profile_image?.insert_key && (
            <Box style={{ flex: 1 }}>
              <Title order={5} mb="sm" style={{ textAlign: 'center' }}>
                Profile Picture
              </Title>
              <Box
                mt="sm"
                style={{
                  border: '1px dashed #ddd',
                  borderRadius: 'var(--mantine-radius-sm)',
                  padding: '0.5rem',
                  minHeight: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_API_FILE_URL}/member_uploads/profile_picture/${details.profile_image.insert_key}`}
                  alt="Profile preview"
                  width={300}
                  height={180}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Signature Card Section */}
          {details?.signature_image?.insert_key && (
            <Box style={{ flex: 1 }}>
              <Title order={5} mb="sm" style={{ textAlign: 'center' }}>
                Signature Card
              </Title>
              <Box
                mt="sm"
                style={{
                  border: '1px dashed #ddd',
                  borderRadius: 'var(--mantine-radius-sm)',
                  padding: '0.5rem',
                  minHeight: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_API_FILE_URL}/member_uploads/signature_card/${details.signature_image.insert_key}`}
                  alt="Signature preview"
                  width={300}
                  height={180}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Box>
          )}
        </Flex>
      ) : (
        <div></div>
      )}
    </form>
  )
}

export default AddMemberUi
