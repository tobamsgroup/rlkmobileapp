import Button from '@/components/Button'
import Container from '@/components/Container'
import { router } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

const HomeKid = () => {
  return (
 <Container>
   <Button onPress={() => router.push('/kid/Mood')} text='Go Mood'/>
 </Container>
  )
}

export default HomeKid
