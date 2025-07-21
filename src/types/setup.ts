export type FiscalYearSetupType = {
  formatCode: string | number
}

export type ExternalSavingAccountSetupType = {
  org_name: string
  acc_name: string
  acc_number: string
}

export type BankAccountSetupType = {
  bank_name: string
  acc_name: string
  acc_number: string
  acc_flag: string
  product_type: string
}

export type TransactionDateSetupType = {
  trnDate: string
}

export type BranchSetupType = {
  name: string
  addr: string | null
  contact: string
}

export type EmployeeSetupType = {
  emp_id: string
  name: string
  designation: string
  addr: string
  contact: string
}

export type ProjectSetupType = {
  project_name: string
  project_location: string
  project_details: string | null
}

export type CreateServiceAreaType = {
  zoneName: string
  locCode: number
}
