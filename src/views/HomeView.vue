<script setup>
import HeaderSection from '@/components/HeaderSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const latestMovies = ref([])
const searchResults = ref([])
const topMovies = ref([])
const people = ref([])
const selectedPersonMovies = ref([])
const searchQuery = ref('')
const apikey = '942eab3ec16f08c32c8509fcdb16fcd4'
const currentCategory = ref(localStorage.getItem('currentCategory') || 'movies')
const showModal = ref(false)
const showPersonModal = ref(false)
const videoUrl = ref('')
const page = ref(1)
const isLoading = ref(false)

const fetchMovies = async (category) => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    let url = ''
    if (category === 'movies') {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&page=${page.value}`
    } else if (category === 'shows') {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${apikey}&with_origin_country=KR&page=${page.value}`
    } else if (category === 'anime') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=16&page=${page.value}`
    } else if (category === 'people') {
      url = `https://api.themoviedb.org/3/person/popular?api_key=${apikey}&page=${page.value}`
    } else if (category === 'top100') {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&page=${page.value}`
    } else if (category === 'variety') {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${apikey}&with_genres=10764&page=${page.value}`
    } else if (category === 'comedy') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=35&page=${page.value}`
    } else if (category === 'action') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=28&page=${page.value}`
    } else if (category === 'romance') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=10749&page=${page.value}`
    } else if (category === 'war') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=10752&page=${page.value}`
    } else if (category === 'thriller') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=53&page=${page.value}`
    } else if (category === 'musical') {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=10402&page=${page.value}`
    }

    const response = await axios.get(url)
    const results = response.data.results.map((item) => ({
      ...item,
      media_type:
        category === 'movies' ||
        category === 'top100' ||
        category === 'comedy' ||
        category === 'action' ||
        category === 'romance' ||
        category === 'war' ||
        category === 'thriller' ||
        category === 'musical'
          ? 'movie'
          : 'tv'
    }))

    if (category === 'people') {
      people.value.push(...results)
    } else if (category === 'top100') {
      topMovies.value.push(...results)
    } else {
      latestMovies.value.push(...results)
    }
    page.value++
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const fetchCategoryData = async (category) => {
  currentCategory.value = category
  localStorage.setItem('currentCategory', category)
  latestMovies.value = []
  topMovies.value = []
  people.value = []
  page.value = 1
  await fetchMovies(category)
}

const searchMovies = async (query) => {
  if (query.trim() === '') {
    searchResults.value = []
    return
  }
  try {
    const searchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${apikey}&query=${query}`
    )
    searchResults.value = searchResponse.data.results
  } catch (error) {
    console.log(error)
  }
}

const fetchPersonMovies = async (personId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apikey}`
    )
    selectedPersonMovies.value = response.data.cast
    showPersonModal.value = true
  } catch (error) {
    console.log(error)
  }
}

const fetchVideo = async (id, mediaType) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apikey}`
    )
    const videos = response.data.results
    const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    } else {
      return ''
    }
  } catch (error) {
    console.log(error)
    return ''
  }
}

const router = useRouter()

const goToMovieDetail = (id, mediaType) => {
  router.push({ name: 'detail', params: { movieID: id, mediaType } })
}

const goToHome = () => {
  searchResults.value = []
  searchQuery.value = ''
  fetchCategoryData(currentCategory.value)
}

const playVideo = async (id, mediaType) => {
  const video = await fetchVideo(id, mediaType)
  if (video) {
    videoUrl.value = video
    showModal.value = true
  } else {
    alert('트레일러 영상을 찾을 수 없습니다.')
  }
}

const playPersonMovieVideo = async (id) => {
  const video = await fetchVideo(id, 'movie')
  if (video) {
    videoUrl.value = video
    showPersonModal.value = false
    showModal.value = true
  } else {
    alert('트레일러 영상을 찾을 수 없습니다.')
  }
}

const closeModal = () => {
  showModal.value = false
  videoUrl.value = ''
  if (currentCategory.value === 'people') {
    showPersonModal.value = true
  }
}

const closePersonModal = () => {
  showPersonModal.value = false
  selectedPersonMovies.value = []
}

const observer = ref(null)
const loadMore = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetchMovies(currentCategory.value)
    }
  })
}

const initializeObserver = () => {
  observer.value = new IntersectionObserver(loadMore, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  })
  if (observer.value) {
    observer.value.observe(document.querySelector('#scroll-anchor'))
  }
}

watch(searchQuery, (newQuery) => {
  searchMovies(newQuery)
})

onMounted(() => {
  fetchCategoryData(currentCategory.value)
  initializeObserver()
})
</script>

<template>
  <HeaderSection @search="searchQuery = $event" />
  <main id="main" role="main">
    <div class="view__inner container">
      <div class="tabs">
        <button
          @click="fetchCategoryData('movies')"
          :class="{ active: currentCategory === 'movies' }"
        >
          영화
        </button>
        <button
          @click="fetchCategoryData('top100')"
          :class="{ active: currentCategory === 'top100' }"
        >
          Top 100
        </button>
        <button
          @click="fetchCategoryData('people')"
          :class="{ active: currentCategory === 'people' }"
        >
          영화인
        </button>
        <button
          @click="fetchCategoryData('shows')"
          :class="{ active: currentCategory === 'shows' }"
        >
          방송
        </button>
        <button
          @click="fetchCategoryData('variety')"
          :class="{ active: currentCategory === 'variety' }"
        >
          예능
        </button>
        <button
          @click="fetchCategoryData('anime')"
          :class="{ active: currentCategory === 'anime' }"
        >
          애니
        </button>
        <button
          @click="fetchCategoryData('comedy')"
          :class="{ active: currentCategory === 'comedy' }"
        >
          코미디
        </button>
        <button
          @click="fetchCategoryData('action')"
          :class="{ active: currentCategory === 'action' }"
        >
          액션
        </button>
        <button
          @click="fetchCategoryData('romance')"
          :class="{ active: currentCategory === 'romance' }"
        >
          로맨스
        </button>
        <button @click="fetchCategoryData('war')" :class="{ active: currentCategory === 'war' }">
          전쟁
        </button>
        <button
          @click="fetchCategoryData('thriller')"
          :class="{ active: currentCategory === 'thriller' }"
        >
          스릴러
        </button>
        <button
          @click="fetchCategoryData('musical')"
          :class="{ active: currentCategory === 'musical' }"
        >
          뮤지컬
        </button>
      </div>
      <div class="cards">
        <div
          v-if="currentCategory !== 'people' && currentCategory !== 'top100'"
          v-for="(item, index) in searchResults.length ? searchResults : latestMovies"
          :key="index"
          class="view__card"
        >
          <img
            :src="
              item.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + item.poster_path
                : 'fallback-image-url.jpg'
            "
            :alt="item.title || item.name"
          />
          <LikeView :item-id="item.id" />
          <h3>{{ item.title || item.name }}</h3>
          <div class="ratings">
            <p>평점: {{ item.vote_average.toFixed(1) }}</p>
            <div class="stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= Math.round(item.vote_average / 2) }"
                >★</span
              >
            </div>
          </div>
          <div class="overlay">
            <button
              class="play-button"
              @click.stop="
                playVideo(item.id, item.media_type || currentCategory === 'movies' ? 'movie' : 'tv')
              "
            >
              ▶️
            </button>
            <button
              class="detail-button"
              @click.stop="
                goToMovieDetail(
                  item.id,
                  item.media_type || currentCategory === 'movies' ? 'movie' : 'tv'
                )
              "
            >
              +
            </button>
          </div>
        </div>
        <div
          v-if="currentCategory === 'people'"
          v-for="(person, index) in people"
          :key="index"
          class="view__card"
          @click="fetchPersonMovies(person.id)"
        >
          <img
            :src="
              person.profile_path
                ? 'https://image.tmdb.org/t/p/w500' + person.profile_path
                : 'fallback-image-url.jpg'
            "
            :alt="person.name"
          />
          <h3>{{ person.name }}</h3>
        </div>
        <div
          v-if="currentCategory === 'top100'"
          v-for="(item, index) in topMovies"
          :key="index"
          class="view__card"
        >
          <img
            :src="
              item.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + item.poster_path
                : 'fallback-image-url.jpg'
            "
            :alt="item.title || item.name"
          />
          <LikeView :item-id="item.id" />
          <h3>{{ item.title || item.name }}</h3>
          <div class="ratings">
            <p>평점: {{ item.vote_average.toFixed(1) }}</p>
            <div class="stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= Math.round(item.vote_average / 2) }"
                >★</span
              >
            </div>
          </div>
          <div class="overlay">
            <button class="play-button" @click.stop="playVideo(item.id, 'movie')">▶️</button>
            <button class="detail-button" @click.stop="goToMovieDetail(item.id, 'movie')">+</button>
          </div>
        </div>
      </div>
      <div id="scroll-anchor"></div>
    </div>
  </main>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <iframe
        :src="videoUrl"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
      <button @click="closeModal" class="close-button">닫기</button>
    </div>
  </div>
  <div
    v-if="showPersonModal && currentCategory === 'people'"
    class="modal-overlay"
    @click="closePersonModal"
  >
    <div class="modal-content" @click.stop>
      <h2>출연 영화</h2>
      <div class="cards">
        <div
          v-for="(movie, index) in selectedPersonMovies"
          :key="index"
          class="view__card"
          @click="playPersonMovieVideo(movie.id)"
        >
          <img
            :src="
              movie.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                : 'fallback-image-url.jpg'
            "
            :alt="movie.title"
          />
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
      <button @click="closePersonModal" class="close-button">닫기</button>
    </div>
  </div>
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
button {
  padding: 10px;
  cursor: pointer;
  color: #fff;
  background-color: #333;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
}
button.active {
  font-weight: bold;
  border: 1px solid #00aaff;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.view__card {
  position: relative;
  padding: 10px;
  width: 324px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.view__card img {
  width: 100%;
  height: auto;
}
.ratings {
  margin-top: 10px;
  font-size: 14px;
}
.stars {
  display: flex;
  justify-content: center;
}
.star {
  color: #d3d3d3;
  font-size: 20px;
}
.star.filled {
  color: #ffc107;
}
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.play-button,
.detail-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 24px;
}
.play-button:hover,
.detail-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  padding: 40px;
  border-radius: 8px;
  width: 80%;
  height: 80%;
  background-color: white;
  overflow-y: auto;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

@media (max-width: 1400px) {
  .view__inner {
    min-width: 100%;
  }
  .tabs {
    /* flex-wrap: wrap; 줄어들었을때 줄바꿈*/
    width: 100%;
    overflow-x: auto;
  }

  button {
    min-width: fit-content; /*컨텐츠의 사이즈에 맞춤*/
  }
}
</style>
