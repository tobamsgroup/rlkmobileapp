import { handleLogout } from '@/actions/logout'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { useAppDispatch } from '@/hooks/redux'
import React from 'react'
import { Text } from 'react-native'

const MoreKid = () => {
    const dispatch = useAppDispatch()
  return (
 <Container>
    <Button onPress={() => handleLogout(dispatch)} className='mt-20 mx-10' text='Logout'/>
 </Container>
  )
}

export default MoreKid
