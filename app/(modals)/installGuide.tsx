import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { getSteps, STORAGE_KEY } from '@/components/installGuide'
import InstallGuide from '@/components/installGuide/ui/InstallGuide'

export default function InstallGuideScreen() {
  const router = useRouter()
  const { from } = useLocalSearchParams<{ from: string }>()
  const steps = getSteps()

  useEffect(() => {
    if (!steps?.length) {
      router.replace((from as string) || '/(tabs)/home')
    }
  }, [])

  const handleDismiss = () => {
    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    router.replace((from as string) || '/(tabs)/home')
  }

  if (!steps?.length) return null

  return <InstallGuide steps={steps} onDismiss={handleDismiss} />
}
