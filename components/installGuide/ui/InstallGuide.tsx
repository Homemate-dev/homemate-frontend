import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

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
    <View style={styles.screen}>
      <GuideVideo currentStep={currentStep} getVideoSource={getVideoSource} />
      <GuideNavigation goNext={goNext} goPrev={goPrev} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
})
