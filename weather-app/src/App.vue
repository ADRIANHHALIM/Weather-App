<template>
  <div class="app">
    <h1>Weather App</h1>

    <!-- Form untuk memasukkan nama kota -->
    <form class="search-form" @submit.prevent="fetchWeather">
      <input v-model="city" placeholder="Masukkan nama kota..." />
      <button type="submit">🔍 Search</button>
    </form>

    <!-- Container Cuaca dengan Peta di Dalamnya -->
    <div class="weather-container" v-if="weather">
      <WeatherDisplay :weather="weather" />

      <!-- Peta akan ditampilkan di dalam container -->
      <div id="map"></div>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="loading">⏳ Memuat Data Cuaca...</p>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import WeatherDisplay from "./components/WeatherDisplay.vue";
import L from "leaflet"; // Import Leaflet.js

export default {
  name: "App",
  components: { WeatherDisplay },
  setup() {
    const store = useStore();
    const weather = computed(() => store.state.weather);
    const loading = computed(() => store.state.loading);
    // const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY; (Jika Subscription dengan OpenWeather bisa menggunakan Maps)
    const city = ref("Jakarta"); // Default kota

    let map = null; // Variabel untuk menyimpan peta

    const fetchWeather = () => {
      store.dispatch("fetchWeather", city.value);
    };

    // Fungsi untuk memperbarui peta dengan CartoDB
    const updateMap = (lat, lon) => {
      setTimeout(() => {
        const mapContainer = document.getElementById("map");
        if (mapContainer) {
          if (!map) {
            map = L.map("map", { zoomControl: true }).setView([lat, lon], 10); // Mengaktifkan kontrol zoom

            // Tile layer untuk OpenStreetMap atau CartoDB
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

          } else {
            map.setView([lat, lon], 10);
          }

          L.marker([lat, lon]).addTo(map).bindPopup(`📍 ${weather.value.name}`).openPopup();
        }
      }, 300);
    };

    // Pantau perubahan data cuaca & perbarui peta
    watch(weather, (newWeather) => {
      if (newWeather) {
        updateMap(newWeather.coord.lat, newWeather.coord.lon);
      }
    });

    onMounted(() => {
      fetchWeather(); // Ambil cuaca saat komponen dimuat
    });

    return { weather, loading, city, fetchWeather };
  },
};
</script>

<style scoped>
/* Tampilan utama */
.app {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* Judul */
h1 {
  font-size: 3em;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}

/* Form Pencarian */
.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input {
  padding: 12px;
  font-size: 1.2em;
  border-radius: 10px;
  border: none;
  outline: none;
  width: 280px;
  text-align: center;
  transition: 0.3s;
}

.search-form input:focus {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.search-form button {
  padding: 12px 18px;
  font-size: 1.2em;
  background: #74ebd5;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.search-form button:hover {
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  transform: scale(1.1);
}

/* CARD CONTAINER */
.weather-container {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  min-width: 320px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  word-break: break-word;
  overflow: hidden; /* Untuk memastikan peta tetap di dalam card */
}

/* Hover effect */
.weather-container:hover {
  transform: scale(1.02);
}

/* Nama Kota */
h2 {
  font-size: 2.2em;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

/* Detail Cuaca */
.details {
  font-size: 1.2em;
  margin-top: 15px;
}

/* Pastikan semua teks bisa terbaca */
h2, h3, h4, .details p {
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

/* Ikon Cuaca */
.weather-icon {
  width: 120px;
  margin-top: 10px;
  animation: bounce 2s linear in;
}

/* Animasi Bounce Untuk Card*/
/* @keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
} */

/* Animasi Loading */
.loading {
  font-size: 1.5em;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in-out infinite alternate;
}

@keyframes fadeIn {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsif untuk layar kecil */
@media (max-width: 400px) {
  .weather-container {
    padding: 30px;
    min-width: 280px;
  }

  .search-form input {
    width: 200px;
  }

  .search-form button {
    font-size: 1em;
  }

  h1 {
    font-size: 2.5em;
  }
}

/* Styling untuk peta */
#map {
  width: 100%;
  height: 300px;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Styling untuk tombol zoom */
.leaflet-control-zoom {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.7); /* Latar belakang transparan */
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Custom zoom-in dan zoom-out button */
.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
  font-size: 2em;
  background-color: #74ebd5;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}

/* Menambahkan simbol + untuk zoom-in dan - untuk zoom-out */
.leaflet-control-zoom-in::before {
  content: "+";
  font-size: 1.8em; /* Ukuran simbol + */
}

.leaflet-control-zoom-out::before {
  content: "-";
  font-size: 1.8em; /* Ukuran simbol - */
}

.leaflet-control-zoom-in:hover,
.leaflet-control-zoom-out:hover {
  background-color: #acb6e5; /* Hover effect */
  transform: scale(1.1); /* Efek zoom-in saat hover */
}

/* Styling untuk button zoom ketika ditekan */
.leaflet-control-zoom-in:active,
.leaflet-control-zoom-out:active {
  transform: scale(0.95); /* Efek zoom-out saat ditekan */
}


</style>
