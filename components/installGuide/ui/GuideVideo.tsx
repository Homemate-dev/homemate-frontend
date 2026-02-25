import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { GuideStepData } from '../constants'

interface Props {
  currentStep: GuideStepData
  getVideoSource: (step: GuideStepData) => number | string | null
}

export default function GuideVideo({ currentStep, getVideoSource }: Props) {
  const initialSource = getVideoSource(currentStep)
  const player = useVideoPlayer(initialSource, (p) => {
    p.loop = false
    p.muted = true
    p.play()
  })

  useEffect(() => {
    const source = getVideoSource(currentStep)
    if (source != null) {
      player.replace(source)
      player.loop = false
      player.muted = true
      player.play()
    }
  }, [currentStep, player, getVideoSource])

  return (
    <>
      {/* 상단 영상 영역 */}
      <View style={styles.imageSection}>
        {currentStep.video != null ? (
          <VideoView
            player={player}
            style={styles.video}
            nativeControls={false}
            contentFit="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>{currentStep.placeholderLabel}</Text>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  imageSection: {
    flex: 1.6,
    backgroundColor: '#F8F8FA',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
  },
})
