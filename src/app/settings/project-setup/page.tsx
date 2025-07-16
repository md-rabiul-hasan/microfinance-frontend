import { getProjectList } from '@actions/project-config'
import ProjectListPageUi from './ui'

type SearchParams = {
  page?: number
  per_page?: number
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

const ProjectListPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const { per_page = 10, page = 1, search = '' } = params

  const res = await getProjectList({ page, per_page, search })

  return <ProjectListPageUi data={res} />
}

export default ProjectListPage
