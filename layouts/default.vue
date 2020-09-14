<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list class="pt-4">
        <v-list-item v-for="(item, i) in items" :key="i" :to="$i18n.path(item.to)" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t(`links.${item.to !== '' ? item.to : 'home'}`) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
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
              href="https://twitter.com/pedraal_"
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
    </v-navigation-drawer>
    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <template v-for="item in items">
        <v-toolbar-title v-if="item.paths.includes($route.name)" :key="item.to" v-html="$t(`title.${item.to !== '' ? item.to : 'home'}`)" />
      </template>
    </v-app-bar>
    <v-main class="mt-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <client-only>
      <VueHandyGa :locales="$t('vuehandyga')" class="foreground" />
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: null,
      items: [
        {
          icon: 'mdi-home',
          paths: ['index', 'lang'],
          to: ''
        },
        {
          icon: 'mdi-movie-open-outline',
          paths: ['clips', 'lang-clips'],
          to: 'clips'
        },
        {
          icon: 'mdi-filmstrip',
          paths: ['replaysync', 'lang-replaysync'],
          to: 'replaysync'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list-item .v-icon {
  text-shadow: -2px 2px #536dfe;
}

.foreground {
  position: fixed;
  z-index: 4;
}

.route-name {
  text-transform: capitalize;
}

.filtered {
  filter: grayscale(100%);
  transition: all .2s ease-in-out;

  &:hover {
    filter: grayscale(0%);
  }
}
</style>
