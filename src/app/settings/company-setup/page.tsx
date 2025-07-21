import { getCompanyInfo } from '@actions/settings/company-config'
import CompanyInfoUi from './ui'

const CompanyInfoPage = async () => {
  const res = await getCompanyInfo()
  return <CompanyInfoUi data={res} />
}

export default CompanyInfoPage
