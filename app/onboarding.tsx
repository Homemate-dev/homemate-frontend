import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontFamily: 'PoetsenOne_400Regular' }]}>HOMEMATE</Text>

      <View style={styles.headerBox}>
        <Text style={styles.title}>여러분의 갓생은 어떠신가요?</Text>
        <Text style={styles.subtitle}>우리의 멋진 일상은{'\n'} 깨끗한 집에서부터 시작해요</Text>
      </View>

      <View style={styles.card}>
   
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>계속</Text>
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
    paddingHorizontal: wp('5%'),
  },
  logo: {
    fontSize: hp('3.5%'),
    color: '#57C9D0',
    fontWeight: '400',
    marginBottom: hp('2%'),
  },
  headerBox: { alignItems: 'center', marginBottom: hp('3%') },
  title: {
    fontSize: hp('2.8%'),
    fontWeight: '600',
    color: '#1D2736',
    marginBottom: hp('0.8%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp('1.8%'),
    color: '#686F79',
    fontWeight: '400',
    textAlign: 'center',
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
  },
  button: {
    backgroundColor: '#57C9D0',
    borderRadius: 12,
    paddingVertical: hp('1.8%'),
    width: wp('90%'),
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});