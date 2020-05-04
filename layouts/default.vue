<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list class="pt-4">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-if="$route.path === '/'">
        <span class="indigo--text text--accent-2 ">Twitch</span><span class="grey--text text--lighten-2 font-weight-thin">Buddy</span>
      </v-toolbar-title>
      <v-toolbar-title v-else>
        <span class="indigo--text text--accent-2 route-name">{{ $route && $route.name.substr(0,1) }}</span><span class="grey--text text--lighten-2 font-weight-thin">{{ $route && $route.name.substr(1) }}</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-content class="mt-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <app-footer />
    <client-only>
      <VueHandyGa class="foreground" />
    </client-only>
  </v-app>
</template>

<script>
import AppFooter from '@/components/layout/AppFooter'

export default {
  components: { AppFooter },
  data () {
    return {
      drawer: null,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-movie-open-outline',
          title: 'Clips',
          to: '/clips'
        },
        {
          icon: 'mdi-filmstrip',
          title: 'Replay Sync',
          to: '/replaysync'
        }
      ],
      title: 'TwitchBuddy'
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
</style>
