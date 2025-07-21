export const formatDateTime = (dateTime: string): string => {
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Parse input datetime
  const date: Date = new Date(dateTime)

  // Extract components
  const day: number = date.getDate()
  const month: string = months[date.getMonth()]
  const year: string = date.getFullYear().toString().slice(-2) // Get last two digits of the year
  let hours: number = date.getHours()
  const minutes: string = String(date.getMinutes()).padStart(2, '0')
  const amPm: string = hours >= 12 ? 'pm' : 'am'

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12

  // Format the final string
  return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`
}

export const formatDateTimeGMT = (dateStr: Date) => {
  const date = new Date(dateStr)
  date.setHours(date.getHours() + 6) // Add 6 hours for BST (GMT+6)
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export const formatDate = (dateString: string): string => {
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const date = new Date(dateString)

  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided')
  }

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}
