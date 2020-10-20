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
        <NavDrawerFooter />
      </template>
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <template v-for="item in items">
        <v-toolbar-title v-if="item.paths.includes($route.name)" :key="item.to" v-html="$t(`title.${item.to !== '' ? item.to : 'home'}`)" class="page-title" />
      </template>
      <v-spacer />
      <v-btn :href="apiLoginUrl" v-if="$store.state.api.user === null" small target="_top" color="#5f33af">
        <v-icon class="mr-2" small>
          mdi-twitch
        </v-icon>
        {{ $t('user.login') }}
      </v-btn>

      <UserMenu v-else />
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <client-only>
      <VueHandyGa :locales="$t('vuehandyga')" class="foreground" />
    </client-only>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
import NavDrawerFooter from '~/components/utils/NavDrawerFooter'
import UserMenu from '~/components/utils/UserMenu'

export default {
  name: 'DefaultLayout',
  components: {
    UserMenu,
    NavDrawerFooter
  },
  data () {
    return {
      apiLoginUrl: process.env.API_URL + '/auth/twitch',
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
  },
  async created () {
    if (Cookies.get('tbtoken')) {
      try {
        const { data } = await this.$api.get('/me')
        this.$store.dispatch('api/setUser', data)
      } catch (error) {
        Cookies.remove('tbtoken')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.foreground {
  position: fixed;
  z-index: 4;
}

.route-name {
  text-transform: capitalize;
}

.menu-item:before {
  opacity: 0 !important;
}
</style>

<style lang="scss">
.page-title {
  span:last-of-type {
   font-weight: 300;
  }
}
@media (min-width: 1904px) {
  .container {
    max-width: 1185px;
  }
}
</style>
