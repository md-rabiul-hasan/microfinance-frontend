import { getFirscalYear } from '@actions/fiscal-year-config';
import FiscalYearUi from './ui';


const FiscalYearPage = async () => {
  const res = await getFirscalYear();
  return <FiscalYearUi data={res} />
}

export default FiscalYearPage
