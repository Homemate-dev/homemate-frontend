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
  })

  // statusChange 리스너: readyToPlay 되면 자동재생
  useEffect(() => {
    const subscription = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') {
        player.play()
      }
    })
    return () => subscription.remove()
  }, [player])

  // 스텝 변경 시 소스 교체 (play는 statusChange에서 처리)
  useEffect(() => {
    const source = getVideoSource(currentStep)
    if (source != null) {
      player.replace(source)
      player.loop = false
      player.muted = true
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
            playsInline={true}
            pointerEvents="none"
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
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#F8F8FA',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '100%',
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
