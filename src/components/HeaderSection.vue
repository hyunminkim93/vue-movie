<script setup>
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
</script>

<template>
  <header id="header" role="banner" class="header">
    <div class="header__inner container">
      <div class="logo">
        <h1>
          <img src="../../public/Movie.png" alt="영화를 검색하다 로고" class="logo-img" />
          <span class="logo-text">Movie informaiton</span>
        </h1>
      </div>
    </div>
    <div class="submenu">
      <button>상세검색</button>
      <input
        type="text"
        v-model="localSearchQuery"
        @keypress="handleKeyPress"
        placeholder="영화 검색"
        class="search-input"
      />
      <button @click="handleSearch" class="search-button">🔍</button>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  background-color: #1c1c1c;
  color: #fff;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: red;
    display: flex;
    align-items: center;
  }

  .logo-img {
    width: 40px;
    height: auto;
    margin-right: 10px;
    border-radius: 50px;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: red;
  }
}

.nav {
  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    .nav__item {
      margin-right: 20px;
      font-size: 16px;
      position: relative;
      display: flex;
      align-items: center;

      .rating {
        background-color: red;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
}

.actions {
  display: flex;
  align-items: center;

  .search-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-right: 20px;
  }

  .login-button {
    background-color: #e50914;
    border: none;
    border-radius: 3px;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: #f40612;
    }
  }
}

.submenu {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #1c1c1c;

  button,
  select,
  input {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 3px;
    font-size: 18px;

    &:hover {
      background-color: #444;
    }
  }

  button {
    cursor: pointer;
  }

  input {
    background-color: #444;
    padding: 5px;
    color: #fff;
    border: none;
    border-radius: 3px;
  }
}

#main {
  background-color: #141414;
  padding: 20px 0;
  margin-top: 20px;
  .view__inner {
    max-width: 1200px;
    margin: 0 auto;

    .tabs {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;

      .tab {
        background-color: #1c1c1c;
        color: #fff;
        padding: 10px 20px;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;

        &.active {
          border: 1px solid #00aaff;
        }

        .rating {
          background-color: red;
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 12px;
          margin-left: 5px;
        }
      }
    }

    .cards {
      display: flex;
      flex-wrap: wrap;

      .view__card {
        background-color: #1c1c1c;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        color: #fff;
      }
    }
  }
}
</style>
