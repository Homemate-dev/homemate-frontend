import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { GuideStepData } from '../constants'
import GuideNavigation from './GuideNavigation'
import GuideVideo from './GuideVideo'
import { useCachedSteps } from '../hooks/useCachedSteps'

interface Props {
  steps: GuideStepData[]
  onDismiss: () => void
}

export default function InstallGuide({ steps, onDismiss }: Props) {
  const [step, setStep] = useState(0)
  const { getVideoSource, steps: guideSteps } = useCachedSteps(steps)

  const currentStep = guideSteps[step]
  const isFirst = step === 0
  const isLast = guideSteps.length > 0 && step === guideSteps.length - 1

  const goNext = () => {
    if (isLast) onDismiss()
    else setStep((s) => s + 1)
  }

  const goPrev = () => {
    if (!isFirst) setStep((s) => s - 1)
  }

  return (
    <SafeAreaView style={styles.screen}>
      <GuideVideo key={step} currentStep={currentStep} getVideoSource={getVideoSource} />
      <GuideNavigation goNext={goNext} goPrev={goPrev} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
