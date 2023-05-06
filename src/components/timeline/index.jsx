import { useState, useRef, useEffect, Fragment } from 'react'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { isBetween8and18, getMinutesFrom8ToNow } from '../../utils'
import { items } from '../../constant'
import './index.css'

// const items = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
//   '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
//   '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
//   '17:00', '17:30', '18:00'
// ]

const TimeLine = () => {
  const timelineRef = useRef()
  const timeAxisRef  = useRef()
  const [expand, setExpand] = useState(true)
  const [showTimeAxis, setShowTimeAxis] = useState(isBetween8and18)
  const [minutes, setMinutes] = useState(getMinutesFrom8ToNow)

  const handleClickIcon = () => {
    if (timelineRef.current) {
      setExpand(preExpand => {
        if (preExpand) {
          timelineRef.current.style.right = '-240px'
        } else {
          timelineRef.current.style.right = 0
        }
        return !preExpand
      })
    }
  }

  const getMinutes = () => {
    const timer = setInterval(() => {
      if (isBetween8and18()) {
        const current = dayjs().unix()
        if (current % 60 === 0) {
          timeAxisRef.current?.scrollIntoView()
          setMinutes(getMinutesFrom8ToNow())
        }
      } else {
        setShowTimeAxis(false)
      }
    }, 1000)

    return timer
  }

  useEffect(() => {
    timeAxisRef.current?.scrollIntoView()
    let timer = getMinutes()

    const onVisibilitychange = () => {
      if (document.hidden) {
        clearInterval(timer)
      } else {
        timeAxisRef.current?.scrollIntoView()
        setMinutes(getMinutesFrom8ToNow())
        timer = getMinutes()
      }
    }

    document.addEventListener('visibilitychange', onVisibilitychange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilitychange)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className='timeline-container' ref={timelineRef}>
      <div className='timeline-container-header'>
        <div>Now / 现在</div>
        <div>2023-04-18 Tue / 星期二</div>
      </div>
      <div className='timeline-container-icon' onClick={handleClickIcon}>
        {
          expand ?
            <RightCircleOutlined style={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} /> :
            <LeftCircleOutlined style={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} />
        }
      </div>
      <div className='timeline-item-container'>
        <div className='time-axis' style={{ top: `calc(24px + 100px / 30 * ${minutes})`, display: showTimeAxis ? 'flex' : 'none' }} ref={timeAxisRef} >
          <div className='time-axis-dot'></div>
          <div className='time-axis-line'></div>
        </div>
        {
          items.map((i, index) => {
            const { time, meeting: { name, begin, end } } = i

            const hasMeeting = !!begin && !!end
            
            const currentStr = dayjs().format('YYYY-MM-DD')
            const timeUnix = hasMeeting ? dayjs(`${currentStr} ${time}`).unix() : 0
            const beginUnix = hasMeeting ? dayjs(`${currentStr} ${begin}`).unix() : 0
            const endUnix = hasMeeting ? dayjs(`${currentStr} ${end}`).unix() : 0

            const height = (endUnix - beginUnix) / 60
            const top = (beginUnix - timeUnix) / 60

            const isShowDuration = hasMeeting && (endUnix - beginUnix) / 60 >= 30
            const duration = isShowDuration ? `${begin} - ${end}` : ''

            return (
              <Fragment key={time}>
                <div className='timeline-timeline-container'>
                  <div className='timeline-timeline-value'>{time}</div>
                  <div className='timeline-timeline-line'></div>
                </div>
                {index !== items.length - 1 && (
                  <div className='timeline-content-wrapper'>
                    {
                      hasMeeting && (
                        <div
                          className='timeline-content-container'
                          style={{ height: `calc(${height}px * 3.2)`, top: `calc(${top}px * 3.2)` }}
                        >
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{name}</div>
                          {
                            isShowDuration && (<div style={{ fontSize: 16 }}>{duration}</div>)
                          }
                        </div>
                      )
                    }
                  </div>
                )}
              </Fragment>
            )
          })
        }
      </div>
    </div>
  )
}

export default TimeLine
