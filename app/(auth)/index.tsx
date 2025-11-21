import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const SCREEN_WIDTH = Dimensions.get('window').width
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

/* ---------- 타입 ---------- */
type SlideImageItem = { source: ImageSourcePropType; style: ImageStyle }
type SlideBase = { id: number; title: string; subtitle: string; showQuote?: boolean }
type SlideSingle = SlideBase & {
  image: ImageSourcePropType
  imageStyle: ImageStyle
  images?: undefined
}
type SlideMultiple = SlideBase & { images: SlideImageItem[]; image?: undefined }
type Slide = SlideSingle | SlideMultiple
/* ------------------------- */

export default function OnboardingScreen() {
  const router = useRouter()
  const listRef = useRef<FlatList<Slide>>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // 원형 진행바
  const percentage = 86.9
  const radius = 40
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const progress = useSharedValue(0)
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }))
  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    })
  }, [])

  const slides: Slide[] = [
    {
      id: 1,
      title: '여러분의 갓생은 어떠신가요?',
      subtitle: '우리의 멋진 일상은\n깨끗한 집에서부터 시작해요.',
      image: require('../../assets/images/card/ironing1.png'),
      showQuote: true,
      imageStyle: { width: 215, height: 320, position: 'absolute', right: 20, bottom: 20 },
    },
    {
      id: 2,
      title: '홈메이트가 집안일을 추천해드려요',
      subtitle: '여러분의 건강과 관련된 집안일 설정을 위해\n다양한 집안일을 추천해요.',
      image: require('../../assets/images/card/ironing2.png'),
      showQuote: false,
      imageStyle: {
        width: 270,
        height: 380,
        position: 'relative',
        alignSelf: 'center',
        bottom: -30,
      },
    },
    {
      id: 3,
      title: '직접 집안일을 추가할 수 있어요',
      subtitle: '이미 알고 있는 일이 있다면 직접\n집안일 일정을 세우고 수정할 수 있어요.',
      images: [
        {
          source: require('../../assets/images/card/ironing3.png'),
          style: { width: 270, height: 380, position: 'relative', alignSelf: 'center', top: -35 },
        },
        {
          source: require('../../assets/images/card/ironing4.png'),
          style: {
            width: 270,
            height: 380,
            position: 'relative',
            alignSelf: 'center',
            bottom: 360,
          },
        },
      ],
    },

    {
      id: 4,
      title: '홈메이트를 홈화면에 추가해보세요',
      subtitle: '홈화면에 추가하면 \n  생각 날때마다 찾기 쉬우실 거에요',
      image: require('../../assets/images/card/ironing5.png'),
      showQuote: false,
      imageStyle: { width: 270, height: 380, position: 'absolute', right: -15, top: 0 },
    },
  ]

  const isLastSlide = activeIndex === slides.length - 1

  const ADD_HOME_URL =
    'https://classy-group-db3.notion.site/2b0aba73bec6800dba89f717e4b5b9d6?source=copy_link'

  /* ---------- 인덱스 동기화 (스와이프 시 실시간 반영) ---------- */
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / SCREEN_WIDTH)
    if (idx !== activeIndex) setActiveIndex(idx)
  }

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / SCREEN_WIDTH)
    if (idx !== activeIndex) setActiveIndex(idx)
  }

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index?: number | null }[] }) => {
      const i = viewableItems?.[0]?.index
      if (typeof i === 'number' && i !== activeIndex) setActiveIndex(i)
    }
  ).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current
  /* ----------------------------------------------------------- */

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const next = activeIndex + 1
      listRef.current?.scrollToIndex({ index: next, animated: true })
      setActiveIndex(next) // 안전장치
    } else {
      router.replace('/login')
    }
  }

  const handleSkip = () => {
    // 온보딩 스킵 시 로그인 화면으로 이동
    router.replace('/(auth)/login')
  }

  const handleAddToHome = () => {
    // 홈화면에 추가 클릭 시 노션 페이지로 이동
    Linking.openURL(ADD_HOME_URL)
  }

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.slideInner}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.card}>
          {item.showQuote && (
            <>
              <Text style={styles.quote}>“ 살림은 내 일상을{'\n'} 잘 만들어가는 과정이다 ”</Text>
              <View style={styles.rowContainer}>
                <View style={styles.circleContainer}>
                  <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
                    <Circle
                      cx={radius + strokeWidth / 2}
                      cy={radius + strokeWidth / 2}
                      r={radius}
                      stroke="#B3F3F4"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <AnimatedCircle
                      cx={radius + strokeWidth / 2}
                      cy={radius + strokeWidth / 2}
                      r={radius}
                      stroke="#3E7B7F"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      animatedProps={animatedProps}
                      strokeLinecap="butt"
                      rotation="-90"
                      originX={radius + strokeWidth / 2}
                      originY={radius + strokeWidth / 2}
                      fill="none"
                    />
                  </Svg>

                  <View style={styles.circleTextBox}>
                    <Text style={styles.percentTop}>그렇다</Text>
                    <Text style={styles.percentBottom}>{percentage}%</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {'images' in item && item.images ? (
            item.images.map((img: SlideImageItem, idx: number) => (
              <Image key={idx} source={img.source} style={img.style} resizeMode="contain" />
            ))
          ) : 'image' in item && item.image ? (
            <Image source={item.image} style={item.imageStyle} resizeMode="contain" />
          ) : null}
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <View style={styles.logoRow}>
        <Image
          source={require('../../assets/images/logo/logo.png')}
          style={{ width: 148, height: 42 }}
          resizeMode="contain"
        />
      </View>

      {/* 슬라이드 */}
      <View style={styles.slideWrapper}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={SCREEN_WIDTH}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      </View>

      {/* 고정 도트 */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {/* 버튼 */}
      {isLastSlide ? (
        <View style={styles.btnArea}>
          <TouchableOpacity onPress={handleSkip} style={styles.btnSkip}>
            <Text style={styles.btnSkipText}>스킵</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddToHome} style={styles.btnAddHome}>
            <Text style={styles.btnAddHomeText}>홈화면에 추가하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>계속</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 12, paddingBottom: 16 },

  logoRow: {
    width: '100%',
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },

  slideWrapper: { flex: 1, width: '100%', marginBottom: 16 },

  slide: { width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'flex-start' },
  slideInner: { width: '100%', paddingHorizontal: 20, alignItems: 'center' },

  headerBox: { alignItems: 'center', marginTop: 6, marginBottom: 30 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D2736',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#686F79',
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    width: 311,
    height: 420,
    backgroundColor: '#57C9D0',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 0,
    alignSelf: 'center',
    overflow: 'hidden',
  },

  quote: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'left',
    lineHeight: 24,
  },
  rowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  circleContainer: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  circleTextBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
  },
  percentTop: { color: '#F5FCFC', fontSize: 12, fontWeight: '600' },
  percentBottom: { color: '#34797D', fontSize: 12, fontWeight: '600' },

  dotsRow: {
    height: 20,
    marginTop: 8,
    marginBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DADADA', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#57C9D0' },

  btnArea: {
    flexDirection: 'row',
    height: 52,
    marginHorizontal: 20,
  },

  btnSkip: {
    flex: 1,
    backgroundColor: '#E6E7E9',
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSkipText: { fontSize: 16, fontWeight: 600, color: '#8E8E93' },
  btnAddHome: {
    flex: 2,
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAddHomeText: { fontSize: 16, fontWeight: 600, color: '#FFFFFF' },

  button: {
    height: 52,
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',

    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
})
