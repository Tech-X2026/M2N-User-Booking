import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

/** 12-column editorial grid utility — content spans intentionally odd columns */
export default function EditorialGrid({ children, className = '' }: Props) {
  return <div className={`editorial-grid ${className}`}>{children}</div>
}
