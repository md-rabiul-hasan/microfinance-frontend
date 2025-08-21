import { getJournalAccountHeadList } from '@actions/general-accounting/journal-entry-config'
import JournalEntryPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const JournalEntryPage = async ({ searchParams }: Props) => {
  const accounts = await getJournalAccountHeadList()
  return <JournalEntryPageUi accounts={accounts} />
}

export default JournalEntryPage
