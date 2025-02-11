<template>
    <div v-if="weather" :class="['weather-container', weatherBackground]">
      <h2>{{ weather.name }}</h2>
      <h3>{{ weather.main.temp }}°C</h3>
      <h4>{{ weather.weather[0].description }}</h4>
  
      <div class="details">
        <p>💨 Kecepatan Angin: {{ weather.wind.speed }} m/s</p>
        <p>💧 Kelembaban: {{ weather.main.humidity }}%</p>
        <p>🌡️ Tekanan Udara: {{ weather.main.pressure }} hPa</p>
      </div>
  
      <img 
        :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" 
        alt="Weather icon"
        class="weather-icon"
      />
    </div>
  
    <p v-else class="loading">⏳ Memuat Data Cuaca...</p>
  </template>
  
  <script>
  import { watch } from 'vue';
  
  export default {
    props: ['weather'],
    computed: {
      weatherBackground() {
        if (!this.weather || !this.weather.weather) return 'default-bg';
        const desc = this.weather.weather[0].description.toLowerCase();
        if (desc.includes('rain')) return 'rainy';
        if (desc.includes('cloud')) return 'cloudy';
        if (desc.includes('clear')) return 'sunny';
        return 'default-bg';
      }
    },
    watch: {
      weather(newWeather) {
        console.log("🌤️ Data cuaca diperbarui di WeatherDisplay:", newWeather);
      }
    }
  };
  </script>
  
  <style scoped>
  .weather-container {
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    animation: fadeIn 1s ease-in-out;
    max-width: 400px;
    margin: auto;
  }
  
  .weather-icon {
    width: 100px;
    animation: bounce 2s infinite;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
    color: gray;
    margin-top: 20px;
  }
  
  /* Animasi */
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  /* Warna Background Berdasarkan Cuaca */
  .sunny {
    background: linear-gradient(to right, #fbc2eb, #a6c1ee);
  }
  .cloudy {
    background: linear-gradient(to right, #757f9a, #d7dde8);
  }
  .rainy {
    background: linear-gradient(to right, #1e3c72, #2a5298);
  }
  .default-bg {
    background: linear-gradient(to right, #00c6ff, #0072ff);
  }
  
  /* Efek Transisi */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  