import { formatToYMD } from './datetime.util'

export const generate7DigitId = () => {
  // Generate random number between 0 and 9,999,999
  const randomNum = Math.floor(Math.random() * 10_000_000)

  // Convert to string and pad with leading zeros if needed
  return randomNum.toString().padStart(7, '0')
}

export const calculateTotalLoanAmount = (loanAmount: number, profitAmount: number): number => {
  return loanAmount + profitAmount
}

export const calculateCompletionDate = (startDate: string, frequency: 'W' | 'M', tenure: number): string => {
  const date = new Date(startDate)

  if (frequency === 'W') {
    date.setDate(date.getDate() + tenure * 7)
  } else if (frequency === 'M') {
    date.setMonth(date.getMonth() + tenure)
  }

  return formatToYMD(date)
}

export const calculateInstallmentAmount = (totalLoan: number, frequency: 'W' | 'M', tenure: number): number => {
  if (!tenure || tenure <= 0) return 0
  return totalLoan / tenure // Same calculation for weekly/monthly since tenure is in weeks/months
}
