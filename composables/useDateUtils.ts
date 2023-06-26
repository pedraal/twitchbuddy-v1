import { format, formatDistanceToNowStrict } from 'date-fns'

export default function () {
  function formatDistance(date: Date) {
    return formatDistanceToNowStrict(date, { addSuffix: true })
  }

  function formatDate(date: Date) {
    return format(date, 'dd/MM/yyyy HH:mm:ss')
  }

  return {
    formatDistance,
    formatDate,
  }
}
