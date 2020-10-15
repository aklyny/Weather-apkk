import { StatusBar } from 'expo-status-bar';
import React,{useEffect, useState} from 'react';
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';
import UnitPicker from './components/UnitPicker';
import {color} from './Utils'
import ReloadIcon from './components/ReloadIcon';
import WeatherDetail from './components/WeatherDetail';
const WEATHER_API = '86a00cc870448ac3025f4a9e0af47fd5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?'
export default function App() {
  const [err,setErr] = useState(null)
  const [currentWeather,setCurrentWeather] = useState(null)
  const [unitSystem,setUnitSystem] = useState('metric')
  useEffect(()=>{
    load()
  },[unitSystem])
  const load = async ()=>{
    setCurrentWeather(null)
    setErr(null)
    try{
      let {status } = await Location.requestPermissionsAsync()
      if(status != 'granted'){
        setErr('Access to Location is needed')
        return
      }
      const location = await Location.getCurrentPositionAsync()
        const {latitude,longitude} = location.coords
        const weatherUrl = `${BASE_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API}`
        const response =await fetch(weatherUrl)
        const result = await response.json()
        if(response.ok){
          setCurrentWeather(result)
        }else{
          setErr(result.message)
        }
      
    }
    catch(err){
        setErr(err.message)
    }
  }
  if(currentWeather){
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <View style={status.main}>
          <UnitPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
          <WeatherDetail currentWeather={currentWeather} />
        </View>
    </View>
  );
} else if(err){
  return(
    <View style={styles.container}>
      <Text>{err}</Text>
      <StatusBar style="auto" />
   </View>
  )
}else{
  return(
    <View style={styles.container}>
    <ActivityIndicator size="large" color={color.BORDER_COLOR} />
    <StatusBar style="auto" />
 </View>
  )
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main:{
    justifyContent:'center',
    flex:1,
  }
});
