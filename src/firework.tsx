// 删除 React 的导入
import { useState, useEffect } from 'react'

export const Firework = ({
  fireColorGet = 'red',
}: {
  fireColorGet?: string
}): JSX.Element => {
  type Particle = {
    xNow: number
    yNow: number
    xFps: number
    yFps: number
    colorNow: string
    liveTime: number
    tailNum: number
  }

  // 窗口大小
  useEffect(() => {
    console.log('窗口宽度:', window.innerWidth)
    console.log('窗口高度:', window.innerHeight)
  }, [])

  const [FFget, FFset] = useState<Particle[]>([])
  const [FFtailget, FFtailset] = useState<Particle[]>([])

  const fireColor = fireColorGet || 'red'

  // 重力和空气阻力
  const gravity = 1.8
  const airResistance = 1

  // 当 `fireColorGet` 改变时，生成新的烟花粒子
  useEffect(() => {
    FFlogic()
  }, [fireColorGet])

  // 烟花粒子生成逻辑
  function FFlogic() {
    const particleCount = Math.floor(Math.random() * (100 - 50 + 1) + 50) // 粒子数量：50-100
    const newParticles: Particle[] = [] // 为 newParticles 指定类型
    const liveTime = Math.floor(Math.random() * (50 - 15 + 1) + 15) // 粒子存活时间：15-50
    // 烟花爆发的点
    const coordinates = {
      x: Math.floor(Math.random() * (1152 - 384 + 1) + 384),
      y: Math.floor(Math.random() * (346 - 173 + 1) + 173),
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
        colorNow: fireColor,
        liveTime: liveTime,
        tailNum: Math.floor(Math.random() * 5) + 1, // 随机生成 1-3
      }
      newParticles.push(FFone)
    }

    FFset((prev) => [...prev, ...newParticles])
  }

  // 粒子消亡逻辑
  function FFlostLogic() {
    const updatedParticles = FFget.map((particle) => {
      if (particle.liveTime > 0 && particle.yNow < 864) {
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
  function FFTailLostLogic() {
    FFtailset((prevTailParticles) => {
      return prevTailParticles
        .map((particle) =>
          particle.tailNum > 0
            ? { ...particle, tailNum: particle.tailNum - 1 }
            : null
        )
        .filter((particle) => particle !== null)
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      FFlostLogic()
      FFTailLostLogic()
    }, 15)

    return () => clearInterval(interval)
  }, [FFget])

  return (
    <div
      style={{
        backgroundColor: 'black',
        width: '1536px',
        height: '864px',
        overflow: 'hidden',
        margin: '0 auto',
        position: 'relative',
        // backgroundImage: `url(${backgroundImg})`, // 添加背景图片
        backgroundSize: 'cover', // 背景图片覆盖整个容器
        backgroundPosition: 'center', // 背景图片居中
        backgroundRepeat: 'no-repeat', // 防止背景图片重复
        // zIndex: -1, // 确保背景图片层级低
      }}
    >
      {/* 渲染粒子 */}
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
              // borderRadius: "50%", // 变成圆形
              pointerEvents: 'none', // 禁止鼠标事件，使其不可点击
              opacity: 0.01, // 透明
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
