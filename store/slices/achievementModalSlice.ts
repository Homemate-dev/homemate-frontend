import { createSlice } from '@reduxjs/toolkit'

import { PayloadAction } from './../../node_modules/@reduxjs/toolkit/src/createAction'

import type { ImageSourcePropType } from 'react-native'

type AchievementKind = 'mission' | 'badge' | null

type AchievementModalState = {
  isVisible: boolean
  kind: AchievementKind
  title: string
  desc?: string
  icon?: ImageSourcePropType
}

// 초기 상태
const initialState: AchievementModalState = {
  isVisible: false,
  kind: null,
  title: '',
}

const achievementModalSlice = createSlice({
  name: 'achievementModal',
  initialState,
  reducers: {
    // 모달 열기 -> 보여줄 내용 전달
    openAchievementModal: (
      state,
      action: PayloadAction<{
        kind: Exclude<AchievementKind, null>
        title: string
        desc?: string
        icon?: ImageSourcePropType
      }>
    ) => {
      state.isVisible = true
      state.kind = action.payload.kind
      state.title = action.payload.title
      state.desc = action.payload.desc
      state.icon = action.payload.icon
    },

    // 모달 닫기: 값 리셋
    closeAchievementModal: (state) => {
      state.isVisible = false
      state.kind = null
      state.title = ''
      state.desc = undefined
      state.icon = undefined
    },
  },
})

export const { openAchievementModal, closeAchievementModal } = achievementModalSlice.actions
export default achievementModalSlice.reducer
