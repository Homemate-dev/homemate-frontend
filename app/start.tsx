import Constants from "expo-constants";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function StartScreen() {
  const extra = Constants?.expoConfig?.extra ?? {};
  console.log("TEST:", extra.KAKAO_REST_API_KEY, extra.KAKAO_REDIRECT_URI);

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontFamily: "PoetsenOne_400Regular" }]}>HOMEMATE</Text>
      <Text style={styles.subtitle}>주기적인 청소생활 시작</Text>

      <Image
        source={require("../assets/images/start/mop.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.kakaoButton}>
        <Image
          source={require("../assets/images/icon/kakao.png")}
          style={styles.kakaoIcon}
        />
        <Text style={styles.kakaoText}>카카오톡으로 로그인</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        서비스 시작은 <Text style={styles.link}>서비스 이용약관{'\n'}</Text>
        <Text style={styles.link}>개인정보 처리방침</Text> 동의를 의미합니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#57C9D0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
  },
  logo: {
    fontSize: hp('4%'),
    color: '#fff',
    fontWeight: '700',
    marginBottom: hp('2%'),
  },
  subtitle: {
    fontSize: hp('2%'),
    color: '#fff',
    marginBottom: hp('4%'),
  },
  image: {
    width: wp('65%'),
    height: hp('40%'),
    marginBottom: hp('6%'),
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#79D4D9',
    borderRadius: 100,
    paddingVertical: hp('1.8%'),
    width: wp('90%'),
    justifyContent: 'center',
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  kakaoText: {
    fontSize: hp('2%'),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerText: {
    marginTop: hp('3%'),
    fontSize: hp('1.4%'),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    fontWeight: '400',
  },
  link: {
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
