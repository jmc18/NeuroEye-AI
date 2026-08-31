import { forwardRef } from 'react'

type VideoPreviewProps = {
  className?: string
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  function VideoPreview({ className }, ref) {
    return (
      <video
        ref={ref}
        className={className}
        autoPlay
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }}
      />
    )
  },
)
