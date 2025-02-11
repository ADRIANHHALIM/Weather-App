import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Pastikan path ke store benar
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(store); // Tambahkan store ke aplikasi
app.mount('#app');
