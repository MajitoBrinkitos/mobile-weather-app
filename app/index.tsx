import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, ImageBackground } from "react-native";
import axios from 'axios';

    //Background Image
    const image = require('../assets/images/main-img.jpg');
    const imageDay = require('../assets/images/day.jpg');
    const imageNight = require('../assets/images/night.jpg');

    //consts
    const App = () => {
      const [city, setCity] = useState('');
      const [weatherData, setWeatherData] = useState(null);
      const [isDay, setIsDay] = useState(true);

      //const city
      const getCity = async (city) => {
        try {
          const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
          return response.data.results[0];
        } catch (error) {
          console.error(error);
        }
      };

      //const getWeather
      const getWeather = async (latitude, longitude) => {
        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`);
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };

      //const handleSearch
      const handleSearch = async () => {
        const cityData = await getCity(city);
          if(cityData) {
            const weatherData = await getWeather(cityData.latitude, cityData.longitude);

            if(weatherData){
              const country = cityData.country || "Unavailable";
              const temperature = weatherData.current ? weatherData.current.temperature_2m : "N/A";
              const timezone = cityData.timezone || "Unavailable"
              const population = cityData.population || "Unavailable"
              const isDay = weatherData.current ? weatherData.current.is_day : 0;
              setIsDay(isDay);

              //Tomorrow's Forecast
              const tomorrowDate = weatherData.daily.time[1]
              const maxTemp = weatherData.daily.temperature_2m_max[1]            
              const minTemp = weatherData.daily.temperature_2m_min[1]
            }
            setWeatherData({ ...weatherData, cityData });
          } else {
            setWeatherData(null);
          }
        };
    
  
  return (
    //main container
    <View style={styles.container}>
      {/*Background Image */}
      <ImageBackground
        source={image}
        style={styles.image}
        resizeMode='cover'>
          {/*Heading 1 */}
          <Text style={styles.heading1}>Weather You Go</Text>

          {/*Heading 2 */}
          <Text style={styles.heading2}>Where are you going today?</Text>

          {/*Search */}
            <TextInput 
              style={styles.search}
              placeholder='Enter your city...'
              value={city}
              onChangeText={setCity}> 
            </TextInput>
      </ImageBackground>

          {/*Button */}
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? '#a2ef44' : '#0092ca',
                },
                styles.btnGetCity,
              ]}
              onPress={handleSearch}
              >
                <Text style={styles.btnText}>Search</Text>
            </Pressable>
      
      

      {/*Display Weather Information */}
          {weatherData && (
          <View style={styles.displayWeather}>
              <ImageBackground source={isDay ? imageDay : imageNight} style={styles.imageBackground}>
                <View style={styles.overlay}>

                {/*Row */}
                <View style={styles.row}>

                    {/*Column 1 */}
                    <View style={styles.column}>
                      <Text style={styles.dataStyle}>City: {city}</Text>
                      <Text style={styles.dataStyle}>Country: {weatherData.cityData.country}</Text>
                      <Text style={styles.dataStyle}>Population: {weatherData.cityData.population}</Text>
                      <Text style={styles.dataStyle}>Timezone: {weatherData.cityData.timezone} </Text>
                      </View>
                    {/*Column 2 */}
                    <View style={styles.column}>
                      <Text style={styles.dataStyle}>Temperature: {weatherData.current.temperature_2m} °C</Text>
                      {/*Tomorrow's Forecast */}
                      <Text style={styles.dataStyle}>Tomorrow's Forecast: {weatherData.daily.time[1]}</Text>
                      <Text style={styles.dataStyle}>Max. Temp: {weatherData.daily.temperature_2m_max[1]} °C</Text>
                      <Text style={styles.dataStyle}>Min. Temp: {weatherData.daily.temperature_2m_min[1]} °C</Text>
                    </View>

                </View> {/*End Row */}
              </View>
            </ImageBackground>

          </View>

          
        )}

    </View>
  );
};

    //StyleSheet
    const styles = StyleSheet.create({
      body: {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      },
      container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '50%',
        padding: 15,
      },
      heading1: {
        color: 'white',
        fontSize: '70px',
      },
      heading2: {
        color: 'white',
        fontSize: '30px',
      },
      search: {
        flexDirection: 'row',
        alignContent: 'space-around',
        margin: 50,
        padding: 15,
        fontSize: '18px',
        borderColor: '#a2ef44',
        color: 'whitesmoke',
        borderWidth: 3,
      },
      btnGetCity: {
        fontSize: '18px',
        borderRadius: 10,
        margin: '10px',
      },
      btnText : {
        fontSize: '1.75rem',
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#393e46',
        padding: 15,
        color: 'whitesmoke',
        textAlign: 'center',
      },
      image : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      displayWeather: {
        flex: 1,
        padding: 16,
      },
      dataStyle: {
        fontSize: 20,
        color: 'white',
        marginBottom: 8,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      column: {
        flex: 1,
        padding: 8,
      },
      imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      overlay: {
        padding: 20,
        borderRadius: 10,
      },
    });

    export default App;