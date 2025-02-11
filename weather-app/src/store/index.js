import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    weather: null,
    loading: false,
    error: null
  },
  mutations: {
    setWeather(state, data) {
      console.log("✅ Data cuaca diterima:", data); // Debugging
      state.weather = data;
      state.loading = false;
    },
    setLoading(state, status) {
      console.log("⏳ Status loading:", status); // Debugging
      state.loading = status;
    },
    setError(state, message) {
      console.log("❌ Error:", message); // Debugging
      state.error = message;
      state.loading = false;
    }
  },
  actions: {
    async fetchWeather({ commit }, city) {
      commit('setLoading', true);
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        console.log("🔑 API Key digunakan:", API_KEY); // Debugging

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        console.log("🌍 Respons API:", response.data); // Debugging
        commit('setWeather', response.data);
      } catch (error) {
        console.error("❌ Gagal Fetch Data Cuaca:", error);
        commit('setError', 'Gagal mengambil data cuaca');
      }
    }
  },
  getters: {
    getWeather: state => state.weather,
    getLoading: state => state.loading,
    getError: state => state.error
  }
});
