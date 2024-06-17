<template>
  <div class="movie-detail">
    <h1>{{ movie.title }}</h1>
    <div class="movie-content">
      <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" />
      <div class="movie-info">
        <p class="overview">{{ movie.overview }}</p>
        <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
        <p><strong>평점:</strong> {{ movie.vote_average }}</p>
        <p><strong>평가 수:</strong> {{ movie.vote_count }}</p>
      </div>
    </div>
    <div v-if="trailerUrl" class="trailer">
      <h2>예고편</h2>
      <iframe
        width="560"
        height="315"
        :src="trailerUrl"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <button @click="goBackHome" class="back-button">홈 화면으로 가기</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const movie = ref({})
const trailerUrl = ref(null) // 초기 값을 null로 설정
const route = useRoute()
const router = useRouter()
const tmdbApiKey = '942eab3ec16f08c32c8509fcdb16fcd4'

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${route.params.movieID}?api_key=${tmdbApiKey}&language=ko-KR`
    )
    movie.value = response.data

    const videoResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${route.params.movieID}/videos?api_key=${tmdbApiKey}`
    )
    // 다양한 비디오 유형 확인
    const trailers = videoResponse.data.results.filter(
      (video) =>
        ['Trailer', 'Teaser', 'Clip', 'Featurette'].includes(video.type) && video.site === 'YouTube'
    )
    if (trailers.length > 0) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailers[0].key}`
    } else {
      trailerUrl.value = null // 예고편이 없는 경우 null로 설정
    }
  } catch (error) {
    console.log(error)
    trailerUrl.value = null // 오류 발생 시 null로 설정
  }
}

const goBackHome = () => {
  router.push({ name: 'home' })
}

onMounted(fetchMovieDetails)
</script>

<style scoped>
.movie-detail {
  padding: 20px;
  text-align: center;
  background-color: #2c2c2c;
  color: #ffffff;
}

.movie-detail h1 {
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #ffffff;
}

.movie-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.movie-content img {
  width: 300px;
  height: auto;
  border-radius: 10px;
}

.movie-info {
  max-width: 500px;
  text-align: left;
}

.movie-info p {
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 1.2em;
}

.movie-info strong {
  font-weight: bold;
  font-size: 1.2em;
}

.movie-info .overview {
  font-size: 1.3em;
  font-weight: bold;
}

.trailer {
  margin-top: 20px;
}

.trailer h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
}

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #45a049;
}
</style>
