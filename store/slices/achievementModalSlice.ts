import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { ImageSourcePropType } from 'react-native'

// 모달 종류: payload와 state에서 공통으로 사용
type AchievementKind = 'mission' | 'badge'

// 큐에 쌓일 "모달 1개 분량"의 데이터
// 화면에 표시할 데이터 정보들
type AchievementPayload = {
  kind: AchievementKind
  title: string
  desc?: string
  icon?: ImageSourcePropType

  missionId?: number | null
  missionName?: string | null

  badgeId?: string | null
  badgeName?: string | null
}

// 리덕스에 들고 있을 전체 모달 상태
// 모달 상태 + 팝업 히스토리
type AchievementModalState = {
  isVisible: boolean
  kind: AchievementKind | null
  title: string
  desc?: string
  icon?: ImageSourcePropType

  queue: AchievementPayload[] // 다음에 보여줄 모달들

  missionId?: number | null
  missionName?: string | null

  badgeId?: string | null
  badgeName?: string | null
}

// 초기 상태
const initialState: AchievementModalState = {
  isVisible: false,
  kind: null,
  title: '',
  desc: undefined,
  icon: undefined,
  queue: [],

  missionId: null,
  missionName: null,

  badgeId: null,
  badgeName: null,
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

        state.missionId = action.payload.missionId ?? null
        state.missionName = action.payload.missionName ?? null

        state.badgeId = action.payload.badgeId ?? null
        state.badgeName = action.payload.badgeName ?? null
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

        state.missionId = next.missionId ?? null
        state.missionName = next.missionName ?? null

        state.badgeId = next.badgeId ?? null
        state.badgeName = next.badgeName ?? null
      } else {
        state.isVisible = false
        state.kind = null
        state.title = ''
        state.desc = undefined
        state.icon = undefined

        state.missionId = null
        state.missionName = null
        state.badgeId = null
        state.badgeName = null
      }
    },
  },
})

export const { openAchievementModal, closeAchievementModal } = achievementModalSlice.actions
export default achievementModalSlice.reducer
