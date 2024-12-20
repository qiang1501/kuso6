import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'

export default function MusicFireworks() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 播放音频并解析节奏
  const playAudio = (file: File) => {
    const context = new AudioContext()
    const audioElement = new Audio(URL.createObjectURL(file))
    const analyserNode = context.createAnalyser()
    analyserNode.fftSize = 256

    const sourceNode = context.createMediaElementSource(audioElement)
    sourceNode.connect(analyserNode)
    analyserNode.connect(context.destination)

    setAudioContext(context)
    setAnalyser(analyserNode)
    setSource(sourceNode)

    audioElement.play()
    startVisualizing(analyserNode)
  }

  // 可视化烟花效果
  const startVisualizing = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      analyser.getByteFrequencyData(dataArray)

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制烟花
      for (let i = 0; i < dataArray.length; i++) {
        const radius = dataArray[i] / 2 // 将频率值映射为烟花大小
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dataArray[i]}, ${255 - dataArray[i]}, 150, 0.8)`
        ctx.fill()
      }

      requestAnimationFrame(draw)
    }

    draw()
  }

  return (
    <div
      style={{
        textAlign: 'center',
        background: 'black',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <h1>音乐节奏烟花</h1>
      <input
        type='file'
        accept='audio/*'
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            playAudio(e.target.files[0])
          }
        }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ display: 'block', margin: '20px auto', background: 'black' }}
      ></canvas>
    </div>
  )
}
