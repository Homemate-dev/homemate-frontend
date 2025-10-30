import { configureStore } from '@reduxjs/toolkit'

import achievementModalReducer from './slices/achievementModalSlice'

export const store = configureStore({
  reducer: {
    achievementModal: achievementModalReducer,
  },
})

// 앱 전역 상태 타입 (useSelector에서 사용) - 현재 store 안에 뭐가 있는지”를 TS가 알게 함
export type RootState = ReturnType<typeof store.getState>
// 디스패치 타입 (useDispatch에서 사용) - dispatch()가 어떤 액션을 보낼 수 있는지(상태변경) TS가 알게 함
export type AppDispatch = typeof store.dispatch
