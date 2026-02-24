import React from 'react'

type Props = React.PropsWithChildren<{
  style?: React.CSSProperties
  className?: string
}>;

export default function GlassCard({ children, style, className }: Props) {
  return (
    <div className={`glass-card ${className ?? ''}`} style={style}>
      {children}
    </div>
  )
}
