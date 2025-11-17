import { StatusBar } from 'expo-status-bar'

import AddChoreModal from '@/components/Chore/AddChoreModal'

export default function AddChorePage() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#F8F8FA" />

      <AddChoreModal />
    </>
  )
}
