import andSamsungLast from '../../assets/video/installGuide/and_samsung_last.mp4'
import elseLast from '../../assets/video/installGuide/else_last.mp4'
import andChrome01 from '../../assets/video/installGuide/android/and_chrome_01.mp4'
import andChrome02 from '../../assets/video/installGuide/android/and_chrome_02.mp4'
import andChrome03 from '../../assets/video/installGuide/android/and_chrome_03.mp4'
import andChrome04 from '../../assets/video/installGuide/android/and_chrome_04.mp4'
import andEdge01 from '../../assets/video/installGuide/android/and_edge_01.mp4'
import andEdge02 from '../../assets/video/installGuide/android/and_edge_02.mp4'
import andEdge03 from '../../assets/video/installGuide/android/and_edge_03.mp4'
import andEdge04 from '../../assets/video/installGuide/android/and_edge_04.mp4'
import andSamsung01 from '../../assets/video/installGuide/android/and_samsung_01.mp4'
import andSamsung02 from '../../assets/video/installGuide/android/and_samsung_02.mp4'
import andSamsung03 from '../../assets/video/installGuide/android/and_samsung_03.mp4'
import iosChrome01 from '../../assets/video/installGuide/ios/ios_chrome_01.mp4'
import iosChrome02 from '../../assets/video/installGuide/ios/ios_chrome_02.mp4'
import iosChrome03 from '../../assets/video/installGuide/ios/ios_chrome_03.mp4'
import iosChrome04 from '../../assets/video/installGuide/ios/ios_chrome_04.mp4'
import iosEdge01 from '../../assets/video/installGuide/ios/ios_edge_01.mp4'
import iosEdge02 from '../../assets/video/installGuide/ios/ios_edge_02.mp4'
import iosEdge03 from '../../assets/video/installGuide/ios/ios_edge_03.mp4'
import iosEdge04 from '../../assets/video/installGuide/ios/ios_edge_04.mp4'
import iosSafari01 from '../../assets/video/installGuide/ios/ios_safari_01.mp4'
import iosSafari02 from '../../assets/video/installGuide/ios/ios_safari_02.mp4'
import iosSafari03 from '../../assets/video/installGuide/ios/ios_safari_03.mp4'
import iosSafari04 from '../../assets/video/installGuide/ios/ios_safari_04.mp4'
import iosWhale01 from '../../assets/video/installGuide/ios/ios_whale_01.mp4'
import iosWhale02 from '../../assets/video/installGuide/ios/ios_whale_02.mp4'
import iosWhale03 from '../../assets/video/installGuide/ios/ios_whale_03.mp4'
import iosWhale04 from '../../assets/video/installGuide/ios/ios_whale_04.mp4'
import { BrowserType } from './utils/getBrowserType'
import { DeviceType } from './utils/getDeviceType'

export interface GuideStepData {
  title: string
  description: string
  placeholderLabel: string
  video: number | null
}

export const GUIDE_STEPS: Partial<
  Record<DeviceType, Partial<Record<BrowserType, GuideStepData[]>>>
> = {
  ios: {
    whale: [
      {
        title: '하단 메뉴 버튼 탭',
        description: '하단의 메뉴(···) 버튼을 눌러주세요.',
        placeholderLabel: 'Whale iOS Step 1\n메뉴 버튼',
        video: iosWhale01,
      },
      {
        title: '홈 화면에 추가 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Whale iOS Step 2\n홈 화면에 추가',
        video: iosWhale02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Whale iOS Step 3\n추가 확인',
        video: iosWhale03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Whale iOS Step 4\n홈 화면 이동',
        video: iosWhale04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Whale iOS Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
    chrome: [
      {
        title: '하단 공유 버튼 탭',
        description: '하단의 공유(□↑) 버튼을 눌러주세요.',
        placeholderLabel: 'Chrome iOS Step 1\n공유 버튼',
        video: iosChrome01,
      },
      {
        title: '홈 화면에 추가 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Chrome iOS Step 2\n홈 화면에 추가',
        video: iosChrome02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Chrome iOS Step 3\n추가 확인',
        video: iosChrome03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Chrome iOS Step 4\n홈 화면 이동',
        video: iosChrome04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Chrome iOS Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
    edge: [
      {
        title: '하단 메뉴 버튼 탭',
        description: '하단의 메뉴(···) 버튼을 눌러주세요.',
        placeholderLabel: 'Edge iOS Step 1\n메뉴 버튼',
        video: iosEdge01,
      },
      {
        title: '홈 화면에 추가 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Edge iOS Step 2\n홈 화면에 추가',
        video: iosEdge02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Edge iOS Step 3\n추가 확인',
        video: iosEdge03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Edge iOS Step 4\n홈 화면 이동',
        video: iosEdge04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Edge iOS Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
    safari: [
      {
        title: '하단 공유 버튼 탭',
        description: '하단의 공유(□↑) 버튼을 눌러주세요.',
        placeholderLabel: 'Safari iOS Step 1\n공유 버튼',
        video: iosSafari01,
      },
      {
        title: '홈 화면에 추가 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Safari iOS Step 2\n홈 화면에 추가',
        video: iosSafari02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Safari iOS Step 3\n추가 확인',
        video: iosSafari03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Safari iOS Step 4\n홈 화면 이동',
        video: iosSafari04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Safari iOS Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
  },
  android: {
    chrome: [
      {
        title: '주소창 설치 아이콘 탭',
        description: '브라우저 주소창 오른쪽에 있는\n설치(+) 아이콘을 눌러주세요.',
        placeholderLabel: 'Chrome Android Step 1\n주소창 설치 아이콘',
        video: andChrome01,
      },
      {
        title: '설치 확인',
        description: '"설치" 버튼을 눌러\n앱 설치를 진행해주세요.',
        placeholderLabel: 'Chrome Android Step 2\n설치 확인 팝업',
        video: andChrome02,
      },
      {
        title: '설치 중',
        description: '앱이 설치되는 동안\n잠시 기다려주세요.',
        placeholderLabel: 'Chrome Android Step 3\n설치 중',
        video: andChrome03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Chrome Android Step 4\n홈 화면 이동',
        video: andChrome04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Chrome Android Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
    edge: [
      {
        title: '하단 메뉴 버튼 탭',
        description: '하단의 메뉴(···) 버튼을 눌러주세요.',
        placeholderLabel: 'Edge Android Step 1\n메뉴 버튼',
        video: andEdge01,
      },
      {
        title: '홈 화면에 추가 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Edge Android Step 2\n홈 화면에 추가',
        video: andEdge02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Edge Android Step 3\n추가 확인',
        video: andEdge03,
      },
      {
        title: '홈 화면 이동',
        description: '홈 화면으로 이동해주세요.',
        placeholderLabel: 'Edge Android Step 4\n홈 화면 이동',
        video: andEdge04,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Edge Android Step 5\n홈 화면 아이콘',
        video: elseLast,
      },
    ],
    samsung: [
      {
        title: '메뉴 버튼 탭',
        description: '우측 하단의 메뉴(···) 버튼을\n눌러주세요.',
        placeholderLabel: 'Samsung Step 1\n메뉴 버튼',
        video: andSamsung01,
      },
      {
        title: '"홈 화면에 추가" 선택',
        description: '메뉴에서 "홈 화면에 추가"를\n선택하세요.',
        placeholderLabel: 'Samsung Step 2\n홈 화면에 추가',
        video: andSamsung02,
      },
      {
        title: '추가 확인',
        description: '앱 이름을 확인하고\n"추가" 버튼을 눌러주세요.',
        placeholderLabel: 'Samsung Step 3\n추가 확인',
        video: andSamsung03,
      },
      {
        title: '설치 완료!',
        description: '홈 화면에 앱이 추가되었어요.\n아이콘을 탭해서 바로 시작하세요.',
        placeholderLabel: 'Samsung Step 4\n홈 화면 아이콘',
        video: andSamsungLast,
      },
    ],
  },
}
