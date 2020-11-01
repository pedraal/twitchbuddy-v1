<template>
  <div class="pa-2 text-center">
    <p class="mb-3">
      <nuxt-link :class="{filtered: $i18n.locale === 'en' }" :to="$route.fullPath.replace(/^\/[^\/]+/, '')">
        <img src="/fr.png" alt="" width="20">
      </nuxt-link>
      <nuxt-link
        :class="{filtered: $i18n.locale === 'fr' }"
        :to="$i18n.locale === 'en' ? $route.fullPath : `/en${$route.fullPath}`"
      >
        <img src="/uk.png" alt="" width="20">
      </nuxt-link>
    </p>
    <p class="overline mb-0">
      Made with
      <v-icon class="indigo--text text--accent-2">
        mdi-cards-heart
      </v-icon> by
      <a
        href="https://twitter.com/pedraaldev"
        target="_blank"
        class="font-weight-bold blue--text text--accent-2"
      >Pedraal</a>
    </p>
    <v-btn
      small
      text
      href="https://ko-fi.com/pedraaldev"
      target="_blank"
      class="blue--text text--accent-2"
    >
      {{ $t('navfooter.support') }} Ko-fi&nbsp;
      <v-icon small>
        mdi-coffee
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.filtered {
  filter: grayscale(100%);
  transition: all .2s ease-in-out;

  &:hover {
    filter: grayscale(0%);
  }
}
</style>
