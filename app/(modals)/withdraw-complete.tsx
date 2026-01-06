import { router } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { useMyPage } from '@/libs/hooks/mypage/useMyPage'

export default function WithdrawCompleteScreen() {
  const { data: user } = useMyPage()
  const userName = user?.nickname ?? '사용자'

  return (
    <View style={styles.container}>
      {/* 가운데 영역 */}
      <View style={styles.center}>
        <Image
          source={require('../../assets/images/withdraw/withdrawComplete.png')}
          style={styles.image}
        />

        <Text style={styles.title}>탈퇴가 완료되었어요</Text>

        <View style={styles.descArea}>
          <Text style={styles.desc}>{userName}님을 위해</Text>
          <Text style={styles.desc}>더 나은 모습으로 기다리고 있을게요.</Text>
        </View>

        <Text style={styles.desc}>오늘도 좋은 하루 보내세요!</Text>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottom}>
        <Pressable style={styles.btn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>나중에 다시 만나요!</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 333,
    height: 225,

    marginBottom: 26,
  },

  title: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 10,
  },

  descArea: {
    flexDirection: 'column',
    alignItems: 'center',

    marginBottom: 25,
  },

  desc: {
    fontSize: 14,
    lineHeight: 21,
    color: '#686F79',
  },

  bottom: {
    paddingBottom: 24,
  },

  btn: {
    width: '100%',
    height: 52,

    backgroundColor: '#57C9D0',
    color: '#FFFFFF',

    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 700,
  },
})
