export type RegularDepositSetupType = {
  member_key_code: number | string
  account_code: string
  amount: number | string
  deposit_date: string
  remarks: string
}

export type FixedDepositSetupType = {
  member_key_code: number | string
  fdr_length: string | number
  amount: number | string
  opening_date: string
  remarks: string
}