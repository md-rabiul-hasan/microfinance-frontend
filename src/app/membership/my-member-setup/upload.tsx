import { uploadMemberImage } from '@actions/membership/my-member-config'
import { Box, FileInput, Flex, Image, LoadingOverlay, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { getErrorMessage, getSuccessMessage } from '@utils/notification'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { PiSignatureDuotone } from 'react-icons/pi'

const UploadModal = ({ memberKeyCode }: { memberKeyCode: string }) => {
  const [profileLoading, setProfileLoading] = useState(false)
  const [signatureLoading, setSignatureLoading] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  const handleUpload = async (file: File, type: 'PH' | 'SC') => {
    const loadingSetter = type === 'PH' ? setProfileLoading : setSignatureLoading
    const previewSetter = type === 'PH' ? setProfilePreview : setSignaturePreview

    try {
      loadingSetter(true)
      const formData = new FormData()
      formData.append('memberKeyCode', memberKeyCode) // Using the correct prop name
      formData.append('file_type', type)
      formData.append('file', file)

      const res = await uploadMemberImage(formData)
      if (res.success) {
        showNotification(getSuccessMessage(`${type === 'PH' ? 'Profile' : 'Signature'} uploaded successfully`))
        // Create preview
        const reader = new FileReader()
        reader.onload = () => previewSetter(reader.result as string)
        reader.readAsDataURL(file)
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      showNotification(getErrorMessage(error instanceof Error ? error.message : 'Upload failed'))
    } finally {
      loadingSetter(false)
    }
  }

  const handleProfileChange = (file: File | null) => {
    if (file) {
      handleUpload(file, 'PH')
    } else {
      setProfilePreview(null)
    }
  }

  const handleSignatureChange = (file: File | null) => {
    if (file) {
      handleUpload(file, 'SC')
    } else {
      setSignaturePreview(null)
    }
  }

  return (
    <Box>
      <Title order={4} mb="md">
        Upload Profile And Signature Image
      </Title>

      <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
        <Box style={{ flex: 1 }} pos="relative">
          <LoadingOverlay visible={profileLoading} overlayProps={{ blur: 2 }} />
          <FileInput
            leftSection={<FaUser />}
            label="Profile Picture (PH)"
            description="Will upload automatically when selected"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            onChange={handleProfileChange}
            value={profilePreview ? undefined : null}
            clearable
          />
          {profilePreview && (
            <Box
              mt="sm"
              style={{ border: '1px dashed #ddd', borderRadius: 'var(--mantine-radius-sm)', padding: '0.5rem' }}
            >
              <Image
                src={profilePreview}
                alt="Profile preview"
                height={180}
                fit="contain"
                style={{ maxWidth: '100%' }}
              />
            </Box>
          )}
        </Box>

        <Box style={{ flex: 1 }} pos="relative">
          <LoadingOverlay visible={signatureLoading} overlayProps={{ blur: 2 }} />
          <FileInput
            leftSection={<PiSignatureDuotone />}
            label="Signature Card (SC)"
            description="Will upload automatically when selected"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            onChange={handleSignatureChange}
            value={signaturePreview ? undefined : null}
            clearable
          />
          {signaturePreview && (
            <Box
              mt="sm"
              style={{ border: '1px dashed #ddd', borderRadius: 'var(--mantine-radius-sm)', padding: '0.5rem' }}
            >
              <Image
                src={signaturePreview}
                alt="Signature preview"
                height={180}
                fit="contain"
                style={{ maxWidth: '100%' }}
              />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default UploadModal
