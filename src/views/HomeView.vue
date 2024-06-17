<script setup>
import HeaderSection from '@/components/HeaderSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const latestMovies = ref([])
const searchResults = ref([])
const searchQuery = ref('')
const apikey = '942eab3ec16f08c32c8509fcdb16fcd4'

const fetchMovies = async () => {
  try {
    const latestResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&page=1`
    )
    latestMovies.value = latestResponse.data.results
  } catch (error) {
    console.log(error)
  }
}

const searchMovies = async (query) => {
  try {
    if (query.trim() === '') {
      searchResults.value = []
      return
    }
    const searchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}`
    )
    searchResults.value = searchResponse.data.results
  } catch (error) {
    console.log(error)
  }
}

const router = useRouter()

const goToMovieDetail = (id) => {
  router.push({ name: 'detail', params: { movieID: id } })
}

watch(searchQuery, (newQuery) => {
  searchMovies(newQuery)
})

onMounted(fetchMovies)
</script>

<template>
  <HeaderSection @search="searchQuery = $event" />
  <main id="main" role="main">
    <div class="view__inner container">
      <div class="tabs">
        <div class="tab active">최신영화</div>
      </div>
      <div class="cards">
        <div
          v-for="(movie, index) in searchResults.length ? searchResults : latestMovies"
          :key="index"
          :class="'view__card style' + (index + 1)"
          @click="goToMovieDetail(movie.id)"
        >
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </main>
  <FooterSection />
</template>

<style scoped>
.view__inner {
  margin: 0 auto;
  padding: 20px;
}
.tabs {
  display: flex;
  margin-bottom: 20px;
}
.tab {
  padding: 10px;
  cursor: pointer;
}
.tab.active {
  font-weight: bold;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.view__card {
  border: 1px solid #ccc;
  padding: 10px;
  width: calc(20% - 20px);
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.view__card img {
  width: 100%;
  height: auto;
}
</style>
