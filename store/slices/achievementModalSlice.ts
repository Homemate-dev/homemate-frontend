import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { ImageSourcePropType } from 'react-native'

// 모달 종류: payload와 state에서 공통으로 사용
type AchievementKind = 'mission' | 'badge'

// 큐에 쌓일 "모달 1개 분량"의 데이터
type AchievementPayload = {
  kind: AchievementKind
  title: string
  desc?: string
  icon?: ImageSourcePropType | string
}

// 리덕스에 들고 있을 전체 모달 상태
type AchievementModalState = {
  isVisible: boolean
  kind: AchievementKind | null
  title: string
  desc?: string
  icon?: ImageSourcePropType | string
  queue: AchievementPayload[] // 다음에 보여줄 모달들
}

// 초기 상태
const initialState: AchievementModalState = {
  isVisible: false,
  kind: null,
  title: '',
  desc: undefined,
  icon: undefined,
  queue: [],
}

const achievementModalSlice = createSlice({
  name: 'achievementModal',
  initialState,
  // 상태를 바꾸는 함수들
  reducers: {
    // 모달 열기 -> 보여줄 내용 전달
    openAchievementModal: (state, action: PayloadAction<AchievementPayload>) => {
      const payload = action.payload

      if (!state.isVisible && state.kind === null) {
        state.isVisible = true
        state.kind = action.payload.kind
        state.title = action.payload.title
        state.desc = action.payload.desc
        state.icon = action.payload.icon
      } else {
        state.queue.push(payload)
      }
    },

    // 모달 닫기: 값 리셋
    closeAchievementModal: (state) => {
      if (state.queue.length > 0) {
        const next = state.queue.shift()!

        state.isVisible = true
        state.kind = next.kind
        state.title = next.title
        state.desc = next.desc
        state.icon = next.icon
      } else {
        state.isVisible = false
        state.kind = null
        state.title = ''
        state.desc = undefined
        state.icon = undefined
      }
    },
  },
})

export const { openAchievementModal, closeAchievementModal } = achievementModalSlice.actions
export default achievementModalSlice.reducer
