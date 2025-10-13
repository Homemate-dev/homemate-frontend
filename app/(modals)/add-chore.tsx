
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'react-native'


import AddChoreModal from '@/components/Chore/AddChoreModal'


export default function AddChorePage() {
  const { mode } = useLocalSearchParams<{ mode?: 'add' | 'edit' }>()
  const theMode: 'add' | 'edit' = mode === 'edit' ? 'edit' : 'add'


  return (
    <>
      <StatusBar style="dark" backgroundColor="#F8F8FA" />

      <AddChoreModal mode={theMode} />
    </>

  )
}
