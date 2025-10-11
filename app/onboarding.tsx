import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Svg, { Circle } from 'react-native-svg';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function OnboardingScreen() {
  const router = useRouter();
  const swiperRef = useRef<SwiperFlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const percentage = 86.9;
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const slides = [
    {
      id: 1,
      title: '여러분의 갓생은 어떠신가요?',
      subtitle: '우리의 멋진 일상은\n깨끗한 집에서부터 시작해요',
      image: require('../assets/images/card/ironing1.png'),
      showQuote: true,
      imageStyle: {
        width: wp('55%'),
        height: hp('38%'),
        position: 'absolute',
        right: wp('5%'),
        bottom: hp('2.5%'),
      },
    },
    {
      id: 2,
      title: '홈메이트가 집안일을 추천해드려요',
      subtitle:
        '여러분의 건강과 관련된 집안일 설정을 위해\n다양한 집안일을 추천해요.',
      image: require('../assets/images/card/ironing2.png'),
      showQuote: false,
      imageStyle: {
        width: wp('70%'),
        height: hp('45%'),
        position: 'relative',
        right: 0,
        alignSelf: 'center',
        bottom: hp('-4%'),
      },
    },
    {
      id: 3,
      title: '직접 집안일을 추가할 수 있어요',
      subtitle: '이미 알고 있는 일이 있다면 직접\n집안일 일정을 세우고 수정할 수 있어요.',
      image: require('../assets/images/card/ironing3.png'),
      images: [
      {
        source: require('../assets/images/card/ironing3.png'),
        style: {
          width: wp('70%'),
          height: hp('45%'),
          position: 'relative',
          right: 0,
          alignSelf: 'center',
          top: hp('-4%'),
        },
      },
      {
        source: require('../assets/images/card/ironing4.png'),
        style: {
          width: wp('70%'),
          height: hp('45%'),
          position: 'relative',
          right: 0,
          alignSelf: 'center',
          bottom: hp('42.5%'),
        },
      },
    ],
  },
  ];

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      swiperRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.replace('/start');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontFamily: 'PoetsenOne_400Regular' }]}>
        HOMEMATE
      </Text>

      {/* 슬라이드 */}
      <View style={styles.slideWrapper}>
        <SwiperFlatList
          ref={swiperRef}
          showPagination
          paginationActiveColor="#57C9D0"
          paginationDefaultColor="#DADADA"
          paginationStyle={styles.paginationContainer}
          paginationStyleItem={styles.paginationItem}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const width = e.nativeEvent.layoutMeasurement.width;
            const index = Math.round(offsetX / width);
            setActiveIndex(index);
          }}
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.headerBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              {/* 카드 */}
              <View style={styles.card}>
                {/* 상단 문구 */}
                {item.showQuote && (
                  <>
                    <Text style={styles.quote}>
                      “ 살림은 내 일상을{'\n'}   잘 만들어가는 과정이다 ”
                    </Text>

                    <View style={styles.rowContainer}>
                      {/* 원형 그래프 */}
                      <View style={styles.circleContainer}>
                        <Svg
                          width={radius * 2 + strokeWidth}
                          height={radius * 2 + strokeWidth}
                        >
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

              {/* 이미지 */}
              {item.images
                ? item.images.map((img: { source: any; style: any }, idx: number) => (
                    <Image
                      key={idx}
                      source={img.source}
                      style={img.style}
                      resizeMode="contain"
                    />
                  ))
                : (
                    <Image
                      source={item.image}
                      style={item.imageStyle}
                      resizeMode="contain"
                    />
                  )}
              </View>
            </View>
          )}
        />
      </View>

      {/* 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {activeIndex === slides.length - 1 ? '시작하기' : '계속'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: hp('3.5%'),
    color: '#57C9D0',
    fontWeight: '400',
    padding: hp('2%'),
  },
  slideWrapper: {
    flexGrow: 1,
    width: wp('100%'),
    maxHeight: hp('80%'),
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp('100%'),
  },
  headerBox: {
    alignItems: 'center',
    marginVertical: hp('3%'),
  },
  title: {
    fontSize: hp('2.8%'),
    fontWeight: '600',
    color: '#1D2736',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp('1.8%'),
    color: '#686F79',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: hp('3%'),
  },
  card: {
    width: wp('80%'),
    aspectRatio: 295 / 410,
    backgroundColor: '#57C9D0',
    borderRadius: 20,
    paddingVertical: hp('3%'),
    marginBottom: hp('4%'),
    paddingHorizontal: wp('5%'),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  quote: {
    fontSize: hp('2%'),
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: hp('3%'),
    textAlign: 'left',
    lineHeight: hp('3%'),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleTextBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
  },
  percentTop: {
    color: '#F5FCFC',
    fontSize: hp('1.4%'),
    fontWeight: '600',
  },
  percentBottom: {
    color: '#34797D',
    fontSize: hp('1.4%'),
    fontWeight: '600',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: hp('1%'),
    alignSelf: 'center',
  },
  paginationItem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  button: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: hp('1.8%'),
    width: wp('90%'),
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});
