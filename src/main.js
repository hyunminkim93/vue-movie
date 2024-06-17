import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/style.scss'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaFlag, RiZhihuFill } from 'oh-vue-icons/icons'
import { RiMovie2Fill } from 'oh-vue-icons/icons'

addIcons(FaFlag, RiZhihuFill, RiMovie2Fill)

const app = createApp(App)

app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
