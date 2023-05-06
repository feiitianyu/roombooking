import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(isBetween)
dayjs.extend(relativeTime)

export const isBetween8and18 = () => {
  const currentStr = dayjs().format('YYYY-MM-DD')
  const begin = `${currentStr} 08:00`
  const end = `${currentStr} 18:00`

  return dayjs().isBetween(begin, end)
}

// 当时间处于08:00到18:00之间才调用
export const getMinutesFrom8ToNow = () => {
  if (isBetween8and18()) {
    const currentStr = dayjs().format('YYYY-MM-DD')
    const begin = `${currentStr} 08:00`
    return Math.floor((dayjs().unix() - dayjs(begin).unix()) / 60)
  } else {
    return 0
  }
}
