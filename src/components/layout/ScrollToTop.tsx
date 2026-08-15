'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // pathname이 변경될 때마다 화면 스크롤을 맨 위로 고정
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
