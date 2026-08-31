import { useEffect, useRef } from 'react'

import { CalibrationDot } from './CalibrationDot'

type GazeCanvasProps = {
  xNorm: number
  yNorm: number
  stimulus: { x: number; y: number; phase: string } | null
}

export function GazeCanvas({ xNorm, yNorm, stimulus }: GazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(83, 224, 118, 0.25)'
    ctx.beginPath()
    ctx.moveTo(xNorm * width, 0)
    ctx.lineTo(xNorm * width, height)
    ctx.moveTo(0, yNorm * height)
    ctx.lineTo(width, yNorm * height)
    ctx.stroke()
    ctx.fillStyle = '#53e076'
    ctx.beginPath()
    ctx.arc(xNorm * width, yNorm * height, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [xNorm, yNorm])

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} width={1280} height={720} className="size-full" />
      {stimulus ? <CalibrationDot x={stimulus.x} y={stimulus.y} label={stimulus.phase} /> : null}
    </div>
  )
}
