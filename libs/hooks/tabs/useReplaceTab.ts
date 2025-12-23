import { usePathname, useRouter, type Href } from 'expo-router'

export function useReplaceTab() {
  const router = useRouter()
  const pathname = usePathname()

  return (href: Href) => {
    if (pathname === href) return
    router.replace(href as any)
  }
}
