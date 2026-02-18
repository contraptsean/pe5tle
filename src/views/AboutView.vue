<template>
  <div class="about">
    <header class="about__header">
      <router-link class="about__back" to="/">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Pe5tle
      </router-link>
    </header>

    <main class="about__content">
      <h1 class="about__title">About Pe5tle</h1>

      <p class="about__lead">
        Pe5tle is an open-source
        <a href="https://en.wikipedia.org/wiki/Generative_art">generative-style</a>
        glitch art app that takes an image and does stuff with the image data to generate artistic effect.
      </p>

      <section class="about__section">
        <h2 class="about__section-title">Made with</h2>
        <div class="about__tech-list">
          <a href="https://vuejs.org/">Vue 3</a>
          <a href="https://p5js.org/">p5.js</a>
          <a href="https://p5.glitch.me/">p5.glitch</a>
        </div>
      </section>

     

      <section class="about__section">
        <h2 class="about__section-title">Resources</h2>
        <ul class="about__links">
          <li><a href="https://github.com/contraptsean/pe5tle">pe5tle Github</a></li>
          <li><a href="https://www.glitchet.com/">Glitch Art Resources at Glitchet</a></li>
          <li><a href="https://www.facebook.com/groups/GACToolTime/">Glitch Artists Collective: Tool Time on Facebook</a></li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  background: var(--bg-base);
  padding: 0 20px;
}

.about__header {
  padding: 14px 0;
}

.about__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-brand);
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

.about__back:hover {
  opacity: 0.8;
  color: var(--accent);
}

.about__content {
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 0 60px;
}

.about__title {
  font-family: var(--font-brand);
  color: var(--accent);
  font-size: 32px;
  margin-bottom: 20px;
}

.about__lead {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.about__section {
  margin-bottom: 28px;
}

.about__section-title {
  font-family: var(--font-brand);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.about__tech-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.about__tech-list a {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: 13px;
  transition: border-color 0.2s, color 0.2s;
}

.about__tech-list a:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.about__social {
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
}

.about__social p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.about__social p:last-child {
  margin-bottom: 0;
}

.about__links {
  list-style: none;
  padding: 0;
}

.about__links li {
  margin-bottom: 8px;
}

.about__links a {
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.2s;
}

.about__links a:hover {
  color: var(--accent);
}
</style>
