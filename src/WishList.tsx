import { useState, useEffect, useRef } from 'react'

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import './WishLish.css'

export default function WishList() {
  const [beatTimes, setBeatTimes] = useState<number[]>([]) // 用于存储节奏时间数据
  const [beatVolumes, setBeatVolumes] = useState<number[]>([]) // 用于存储音量数据
  const [FFget, FFset] = useState<Particle[]>([])
  const [FFtailget, FFtailset] = useState<Particle[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  // 新增状态 showMain 用于控制是否显示主界面
  const audioRef = useRef<HTMLAudioElement>(null) // 引用音频元素
  // 新增状态：存储当前点击的按钮名称
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0 // 从头开始播放
      audioRef.current.play() // 播放音乐
    }
  }

  const musicSelect = [
    {
      name: 'Canon',
      musicPath: '/Blenders - Canon (remix_George Winston).ogg',
      txtPath: '/Canon.txt',
    },
    {
      name: '深夜高速',
      musicPath: '/Flower.ogg',
      txtPath: '/Flower.txt',
    },
    {
      name: '失くした言葉',
      musicPath: '/No Regret Life - 失くした言葉 (逝去的语言).ogg',
      txtPath: '/失くした言葉.txt',
    },
  ]

  // 增加一组粒子数的按钮，100，200，500，1000，2000，5000，10000
  const lizishu = [
    { name: '100', value: 100 },
    { name: '200', value: 200 },
    { name: '500', value: 500 },
    { name: '1000', value: 1000 },
    { name: '2000', value: 2000 },
    { name: '5000', value: 5000 },
    { name: '10000', value: 10000 },
  ]
  const [selectedParticleCount, setSelectedParticleCount] = useState(100)

  // 加载节奏和音量数据
  useEffect(() => {
    fetch('/DoAsInfinity.txt') // 确保路径为 public 目录下的文件
      .then((response) => response.text())
      .then((data) => {
        const lines = data
          .split('\n')
          .filter((line) => line.trim() !== '' && !line.startsWith('#'))
        const times: number[] = []
        const volumes: number[] = []

        lines.forEach((line) => {
          const [time, volume] = line.split(' ').map(parseFloat)
          times.push(time)
          volumes.push(volume)
        })

        setBeatTimes(times)
        setBeatVolumes(volumes)
      })
  }, [])

  // 粒子类型定义
  type Particle = {
    xNow: number
    yNow: number
    xFps: number
    yFps: number
    colorNow: string
    liveTime: number
    tailNum: number
  }

  const gravity = 1
  const airResistance = 1

  // 烟花粒子生成逻辑
  const FFlogic = (volume: number) => {
    //这里改成选择了的粒子数
    const particleCount = Math.floor(
      Math.pow(volume, 2) * selectedParticleCount
    ) // 使用平方函数调整粒子数

    const newParticles: Particle[] = []
    const liveTime = Math.floor(Math.random() * (50 - 15 + 1) + 15)
    // 烟花爆发的点（通用屏幕比例）
    // 烟花爆发的点（按照比例计算）
    const coordinates = {
      x: Math.floor(
        Math.random() * (window.innerWidth * 0.75 - window.innerWidth * 0.25) +
          window.innerWidth * 0.25
      ),
      y: Math.floor(
        Math.random() * (window.innerHeight * 0.4 - window.innerHeight * 0.2) +
          window.innerHeight * 0.2
      ),
    }

    const randomColor = {
      r: Math.floor(Math.random() * 256), // 随机生成 0-255 的红色值
      g: Math.floor(Math.random() * 256), // 随机生成 0-255 的绿色值
      b: Math.floor(Math.random() * 256), // 随机生成 0-255 的蓝色值
    }

    for (let i = 1; i <= particleCount; i++) {
      const angle = Math.random() * 360
      const radius = Math.random() * 8
      const radians = (angle * Math.PI) / 180

      const x = radius * Math.cos(radians)
      const y = radius * Math.sin(radians)

      const FFone = {
        xNow: coordinates.x,
        yNow: coordinates.y,
        xFps: x,
        yFps: y,
        colorNow: `rgb(${randomColor.r}, ${randomColor.g}, ${randomColor.b})`,
        liveTime: liveTime,
        tailNum: Math.floor(Math.random() * 5) + 1,
      }
      newParticles.push(FFone)
    }

    FFset((prev) => [...prev, ...newParticles])
  }

  // 粒子消亡逻辑
  const FFlostLogic = () => {
    const updatedParticles = FFget.map((particle) => {
      if (particle.liveTime > 0 && particle.yNow < window.innerHeight) {
        const updatedXFps = particle.xFps * (1 - airResistance / 100)
        const updatedYFps =
          particle.yFps * (1 - airResistance / 100) + gravity * 0.1

        return {
          ...particle,
          liveTime: particle.liveTime - 1,
          xNow: particle.xNow + updatedXFps,
          yNow: particle.yNow + updatedYFps,
          xFps: updatedXFps,
          yFps: updatedYFps,
        }
      }
      return null
    }).filter((particle) => particle !== null)

    FFset(updatedParticles)
    FFtailset((prevTailget) => [...prevTailget, ...FFget])
  }

  // 尾巴消亡逻辑
  const FFTailLostLogic = () => {
    FFtailset((prevTailParticles) =>
      prevTailParticles
        .map((particle) =>
          particle.tailNum > 0
            ? { ...particle, tailNum: particle.tailNum - 1 }
            : null
        )
        .filter((particle) => particle !== null)
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      FFlostLogic()
      FFTailLostLogic()
    }, 15)

    return () => clearInterval(interval)
  }, [FFget])

  // 根据节奏播放烟花
  const playFireworks = () => {
    if (isPlaying || beatTimes.length === 0 || beatVolumes.length === 0) return
    playMusic()
    setIsPlaying(true)
    let currentIndex = 0

    beatTimes.forEach((time, index) => {
      setTimeout(() => {
        const volume = beatVolumes[index] || 0.1 // 获取对应音量，默认最小值 0.1
        FFlogic(volume) // 将音量传递给粒子生成逻辑
        currentIndex++
        if (currentIndex === beatTimes.length) {
          setIsPlaying(false) // 重置播放状态
        }
      }, time * 1000) // 转换为毫秒
    })
  }

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'blue',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ color: isPlaying ? 'gray' : 'pink' }}>粒子数を選択</h2>
      <div
        style={{
          pointerEvents: isPlaying ? 'none' : 'auto', // 禁止鼠标事件
          opacity: isPlaying ? 0.5 : 1, // 调整透明度
        }}
      >
        {lizishu.map(({ name, value }) => (
          <Button
            key={name}
            variant='outlined'
            onClick={() => setSelectedParticleCount(value)} // 更新粒子数
            style={{
              margin: '0 5px',
              backgroundColor:
                selectedParticleCount === value ? 'lightblue' : '',
            }}
          >
            {name}
          </Button>
        ))}
      </div>
      <h2 style={{ color: isPlaying ? 'gray' : 'pink' }}>音楽を選ぶ</h2>
      {/* 音频元素 */}
      <audio ref={audioRef} src='public\Flower.ogg' />
      <Stack spacing={2}>
        {/* 歌曲选择按钮 */}
        <div
          style={{
            pointerEvents: isPlaying ? 'none' : 'auto', // 禁止鼠标事件
            opacity: isPlaying ? 0.5 : 1, // 调整透明度
          }}
        >
          {musicSelect.map(({ name, musicPath, txtPath }) => (
            <Button
              key={name}
              variant='outlined'
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.src = musicPath // 更新音频路径
                  setIsPlaying(false) // 停止当前播放
                }

                // 设置当前活动按钮
                setActiveButton(name)

                // 加载节奏和音量数据
                fetch(txtPath)
                  .then((response) => response.text())
                  .then((data) => {
                    const lines = data
                      .split('\n')
                      .filter(
                        (line) => line.trim() !== '' && !line.startsWith('#')
                      )
                    const times: number[] = []
                    const volumes: number[] = []

                    lines.forEach((line) => {
                      const [time, volume] = line.split(' ').map(parseFloat)
                      times.push(time)
                      volumes.push(volume)
                    })

                    setBeatTimes(times)
                    setBeatVolumes(volumes)
                  })
              }}
              // 根据是否是活动按钮改变颜色
              style={{
                margin: '0 5px',
                backgroundColor: activeButton === name ? 'lightblue' : '',
              }}
            >
              {name}
            </Button>
          ))}
        </div>

        {/* 发射烟花按钮 */}
        {/* 发射烟花按钮 */}
        <div>
          <Button
            variant='contained'
            onClick={playFireworks}
            disabled={isPlaying}
          >
            音楽に合わせて花火を打ち上げる！
          </Button>
        </div>
        <div>
          {/* 刷新网页按钮 */}
          <Button
            variant='outlined'
            onClick={() => window.location.reload()} // 刷新网页
            style={{ marginLeft: '10px' }}
          >
            元に戻る
          </Button>
        </div>
      </Stack>

      {/* 粒子渲染 */}
      <div>
        {FFget.map((particle, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${particle.xNow}px`,
              top: `${particle.yNow}px`,
              width: '6px',
              height: '6px',
              backgroundColor: particle.colorNow,
              pointerEvents: 'none',
            }}
          ></div>
        ))}
      </div>
      {/* 渲染尾巴 */}
      <div>
        {FFtailget.map((particle, index) => (
          <div
            key={`tail-${index}`}
            style={{
              position: 'absolute',
              left: `${particle.xNow}px`,
              top: `${particle.yNow}px`,
              width: '4px',
              height: '4px',
              backgroundColor: 'white',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          ></div>
        ))}
      </div>

      {/* 光线渲染 */}
      <div>
        {FFget.map((particle, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${particle.xNow - 30}px`,
              top: `${particle.yNow - 30}px`,
              width: '60px',
              height: '60px',
              backgroundColor: 'rgb(255, 239, 160)',
              pointerEvents: 'none',
              opacity: 0.01,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
