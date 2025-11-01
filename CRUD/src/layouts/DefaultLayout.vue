<template>
  <div class="default-layout">
    <header class="app-header">
      <h1>💰 Финансовый трекер</h1>
      <nav>
        <router-link to="/">Главная</router-link>
        <router-link to="/add">Добавить операцию</router-link>
      </nav>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin-bottom: 1rem;
}

.app-header nav {
  display: flex;
  gap: 2rem;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.app-header nav a:hover {
  background-color: rgba(255,255,255,0.2);
}

.app-header nav a.router-link-active {
  background-color: rgba(255,255,255,0.3);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>