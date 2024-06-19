<template>
  <div class="media-detail">
    <h1>{{ media.title || media.name }}</h1>
    <div class="media-content">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + media.poster_path"
        :alt="media.title || media.name"
      />
      <div class="media-info">
        <p class="overview">{{ media.overview }}</p>
        <p><strong>개봉일:</strong> {{ media.release_date || media.first_air_date }}</p>
        <p><strong>평점:</strong> {{ media.vote_average }}</p>
        <p><strong>평가 수:</strong> {{ media.vote_count }}</p>
      </div>
    </div>
    <div class="cast">
      <strong>출연진</strong>
      <ul>
        <li v-for="actor in cast" :key="actor.cast_id">
          <img :src="'https://image.tmdb.org/t/p/w200' + actor.profile_path" :alt="actor.name" />
          <div class="actor-info">
            <p>{{ actor.name }}</p>
            <p>({{ actor.character }})</p>
          </div>
        </li>
      </ul>
    </div>
    <button @click="goBackHome" class="back-button">페이지로 돌아가기</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const media = ref({})
const cast = ref([])
const route = useRoute()
const router = useRouter()
const tmdbApiKey = '942eab3ec16f08c32c8509fcdb16fcd4'

const fetchMediaDetails = async () => {
  const mediaType = route.params.mediaType
  const mediaID = route.params.movieID
  try {
    const mediaResponse = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaID}?api_key=${tmdbApiKey}&language=ko-KR`
    )
    media.value = mediaResponse.data

    const castResponse = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaID}/credits?api_key=${tmdbApiKey}&language=ko-KR`
    )
    cast.value = castResponse.data.cast.slice(0, 10) // 상위 10명의 출연진을 가져옴
  } catch (error) {
    console.log(error)
  }
}

const goBackHome = () => {
  router.push({ name: 'home' })
}

onMounted(fetchMediaDetails)
</script>

<style scoped>
.media-detail {
  padding: 20px;
  text-align: center;
  background-color: #2c2c2c;
  color: #ffffff;
}

.media-detail h1 {
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #ffffff;
}

.media-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.media-content img {
  width: 300px;
  height: auto;
  border-radius: 10px;
}

.media-info {
  max-width: 500px;
  text-align: left;
}

.media-info p {
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 1.2em;
}

.media-info strong {
  font-weight: bold;
  font-size: 1.2em;
}

.media-info .overview {
  font-size: 1.3em;
  font-weight: bold;
}

.cast {
  margin-top: 20px;
  text-align: left;
}

.cast strong {
  font-size: 1.5em;
  margin-bottom: 10px;
  display: block;
  margin-left: 210px;
}

.cast ul {
  padding-left: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.cast li {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
}

.cast img {
  width: 100px;
  height: 150px;
  border-radius: 5px;
  margin-top: 5px;
}

.actor-info {
  margin-top: 5px;
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
