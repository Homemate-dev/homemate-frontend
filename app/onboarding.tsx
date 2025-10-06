import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

export default function OnboardingScreen() {
  const router = useRouter();
  const swiperRef = useRef<SwiperFlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: '여러분의 갓생은 어떠신가요?',
      subtitle: '우리의 멋진 일상은\n깨끗한 집에서부터 시작해요',
      image: require('../assets/images/card/ironing1.png'),
    },
    {
      id: 2,
      title: '홈메이트가 집안일을 추천해드려요',
      subtitle: '여러분의 건강과 관련된 집안일 설정을\n위해 다양한 집안일을 추천해요.',
      image: require('../assets/images/card/ironing1.png'),
    },
    {
      id: 3,
      title: '직접 집안일을 추가할 수 있어요',
      subtitle: '이미 알고 있는 일이 있다면 직접\n집안일 일정을 세우고 수정할 수 있어요.',
      image: require('../assets/images/card/ironing1.png'),
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
      <Text style={[styles.logo, { fontFamily: 'PoetsenOne_400Regular' }]}>HOMEMATE</Text>

      {/* 슬라이드 */}
      <View style={styles.slideWrapper}>
        <SwiperFlatList
          ref={swiperRef}
          showPagination
          paginationActiveColor="#57C9D0"
          paginationDefaultColor="#DADADA"
          paginationStyle={{
            position: 'absolute',
            bottom: hp('1%'),
            alignSelf: 'center',
          }}
          paginationStyleItem={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 3,
          }}
          onScroll={e => {
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
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
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
    padding:hp('2%'),
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('50%'),
    height: hp('30%'),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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