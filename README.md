# API를 이용한 영화 정보 소개 사이트

# 설치

-- 최신 버전의 Node.js가 설치되어 있는지 확인한 다음 명령줄에 다음 명령을 실행 (`npm init vue@latest`)

-- npm install oh-vue-icons 아이콘 사용시 필요   
-- npm install axios   
-- npm install vue-router   
-- npm install sass   

## 개요

이 영화정보 사이트는 영화, 방송, 애니, Top100, 영화인, 코미디, 액션, 로맨스, 전쟁, 스릴러, 뮤지컬, 공포에 대한 세부 정보를 제공하는 영화 정보 웹사이트의 기획 및 구조를 설명합니다. 이 사이트는 The Movie Database (TMDb) API에서 데이터를 가져와 체계적이고 사용자 친화적인 방식으로 제공합니다. 이 사이트는 Vue.js를 사용하여 구축되었으며 SCSS를 사용하여 스타일링됩니다.

## 주요 기능

1. **영화 세부 정보 페이지**: 선택한 영화의 제목, 개봉일, 평점 및 개요를 포함한 세부 정보를 표시합니다.
2. **홈 페이지**: 현재 상영 중인 영화, 방송 및 평점이 높은 영화를 포함한 다양한 미디어 카테고리를 탐색할 수 있습니다.
3. **검색 기능**: 특정 영화를 검색할 수 있습니다.
4. **카테고리 탭**: 영화, 방송, 애니메이션 및 사람과 같은 다양한 카테고리별로 콘텐츠를 필터링할 수 있습니다.
5. **무한 스크롤**: 사용자가 스크롤할 때 더 많은 콘텐츠를 로드합니다.
6. **모달**: 추가 정보 또는 트레일러를 모달 창에 표시합니다.

## 세부 컴포넌트 설명

### HomeView.vue

이 컴포넌트는 사이트의 메인 랜딩 페이지 역할을 합니다. 사용자가 다양한 미디어 카테고리를 탐색하고 특정 제목이나 사람을 검색할 수 있도록 합니다.

**기능:**

- 영화, 방송, 애니, 배우 및 평점 높은 영화와 같은 카테고리별로 콘텐츠를 필터링하는 탭.
- 사용자가 스크롤할 때 더 많은 콘텐츠를 로드하는 무한 스크롤.
- 트레일러 및 추가 정보를 표시하는 모달 창.
- 특정 영화를 찾기 위한 검색 기능.
- 영화 이미지에 플레이 버튼 클릭시 영상재생.
- 영화에 좋아요 기능 추가.

**구현:**

- `fetchMovies` 함수는 API 호출을 통해 각 카테고리에 해당하는 데이터를 가져옵니다.
- `fetchCategoryData` 함수는 선택한 카테고리에 따라 데이터를 초기화하고 다시 로드합니다.
- `searchMovies` 함수는 사용자가 입력한 검색어를 기반으로 영화를 검색합니다.
- `watch`를 사용하여 `searchQuery`의 변화를 감지하고 실시간으로 검색 결과를 업데이트합니다.

**초기화 및 옵저버 설정**

- `onMounted` 훅을 사용하여 컴포넌트가 마운트될 때 초기 데이터를 로드하고, IntersectionObserver를 초기화합니다.
- `IntersectionObserver` 를 사용하여 사용자가 페이지 하단에 도달할 때 추가 데이터를 로드합니다.

```javascript
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
const apikey = 'YOUR_API_KEY_HERE'
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
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${apikey}&with_genres=16&page=${page.value}`
    } else if (category === 'people') {
      url = `https://api.themoviedb.org/3/person/popular?api_key=${apikey}&page=${page.value}`
    } else if (category === 'top100') {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&page=${page.value}`
    }

    const response = await axios.get(url)
    if (category === 'people') {
      people.value.push(...response.data.results)
    } else if (category === 'top100') {
      topMovies.value.push(...response.data.results)
    } else {
      latestMovies.value.push(...response.data.results)
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
```

**어려웠던 점:**

- 무한 스크롤을 구현하고 로딩 상태를 관리하는 것이 어려웠습니다. 이를 해결하기 위해 IntersectionObserver를 사용하여 사용자가 페이지 하단에 도달할 때마다 데이터를 추가로 로드하도록 구현했습니다.
- 다양한 카테고리를 관리하고 올바른 데이터를 가져오는 것이 까다로웠습니다. 특히, 각 카테고리에 맞는 API 엔드포인트를 구성하고 데이터를 처리하는 부분에서 많은 고민이 필요했습니다.
- 로컬 스토리지를 활용한 데이터 관리는 각 영화마다 좋아요 상태와 개수를 저장하고 불러오는 로직을 구현하는 것이 어려웠습니다.
- 사용자가 페이지를 새로 고침해도 좋아요 상태가 유지되도록 하는 부분이 까다로웠습니다. 이를 해결하기 위해 로컬 스토리지에서 데이터를 가져오고 저장하는 로직을 구현했습니다.

### DetailView.vue

이 컴포넌트는 선택한 영화, 방송, 애니, Top100, 영화인, 코미디, 액션, 로맨스, 전쟁, 스릴러, 뮤지컬, 공포의 세부 정보를 표시하는 역할을 합니다. 경로 매개변수에서 `mediaType` 및 `movieID`를 기반으로 TMDb API에서 데이터를 가져옵니다.

**기능:**

- 제목, 개요, 개봉일 및 평점을 포함한 미디어 세부 정보를 가져와서 표시합니다.
- 포스터 이미지를 표시합니다.
- 홈 페이지로 돌아가는 버튼을 제공합니다.

**구현:**

- `fetchMediaDetails` 함수는 `mediaType`과 `movieID`를 사용하여 TMDb API에서 해당 미디어의 세부 정보를 가져옵니다.
- `onMounted` 라이프사이클 훅을 사용하여 컴포넌트가 마운트될 때 데이터를 가져옵니다.

```javascript
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const media = ref({})
const route = useRoute()
const router = useRouter()
const tmdbApiKey = 'YOUR_API_KEY_HERE'

const fetchMediaDetails = async () => {
  const mediaType = route.params.mediaType
  const mediaID = route.params.movieID
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaID}?api_key=${tmdbApiKey}&language=ko-KR`
    )
    media.value = response.data
  } catch (error) {
    console.log(error)
  }
}

const goBackHome = () => {
  router.push({ name: 'home' })
}

onMounted(fetchMediaDetails)
```

**어려웠던 점:**

- 비동기 데이터 가져오기를 처리하고 UI가 적절히 업데이트되도록 하는 부분이 어려웠습니다. 특히, 데이터를 가져오는 동안 로딩 상태를 관리하고, 데이터가 없는 경우 사용자에게 적절한 메시지를 표시하는 것이 까다로웠습니다.
- 경로 매개변수를 관리하여 올바른 데이터가 가져와지도록 하는 것이 복잡했습니다. 이를 해결하기 위해 Vue Router의 `useRoute` 훅을 사용하여 현재 경로의 매개변수를 쉽게 접근할 수 있도록 했습니다.

### HeaderSection.vue

이 컴포넌트는 로고와 검색 표시줄을 포함한 사이트의 헤더를 포함합니다.

**기능:**

- 사용자가 검색 쿼리를 입력할 수 있도록 합니다.
- 'enter' 키 누름 시 검색 기능을 실행합니다.

**구현:**

- `handleSearch` 함수는 사용자가 입력한 검색어를 상위 컴포넌트로 전달하여 검색을 실행합니다.
- `handleKeyPress` 함수는 사용자가 'Enter' 키를 누를 때 검색을 실행합니다.

```javascript
import { ref } from 'vue'

const emit = defineEmits(['search'])
const localSearchQuery = ref('')

const handleSearch = () => {
  emit('search', localSearchQuery.value)
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
```

**어려웠던 점:**

- 검색 쿼리의 상태를 관리하고 메인 콘텐츠가 업데이트되도록 보장하는 부분이 어려웠습니다. 특히, 사용자가 검색어를 입력할 때마다 실시간으로 결과를 업데이트하도록 구현하는 것이 까다로웠습니다.

## 사이트 디자인 및 사용자 경험

- 다크 테마 사용
- 영화, 방송, 애니, Top100, 영화인, 코미디, 액션, 로맨스, 전쟁, 스릴러, 뮤지컬, 공포 포스터에 평점 및 세부 정보 제공
- 반응형 디자인: 모든 장치에서 좋은 사용자 경험 제공

## 느낀 점

이 영화정보 사이트를 만들면서 Vue.js와 TMDb API를 활용하여 영화 정보를 제공하는 웹사이트를 구축하는 과정에서 많은 것을 배울 수 있었습니다. 특히 비동기 데이터 처리와 상태 관리의 중요성을 실감할 수 있었으며, 다양한 컴포넌트 간의 데이터를 효율적으로 관리하는 방법을 익힐 수 있었습니다. 검색 기능 구현과 무한 스크롤 처리 과정에서 여러 번의 시행착오를 겪으며, 사용자 경험을 최적화하기 위한 다양한 접근 방식을 고민하게 되었습니다. 또한, 로컬 스토리지를 활용한 데이터 관리를 통해 실제 사용자에게 더 나은 서비스를 제공하기 위한 기술적 역량을 향상시킬 수 있었습니다.
