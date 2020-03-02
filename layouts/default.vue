<template>
  <v-app dark>
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
      elevation="1"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title><span class="grey--text text--lighten-2 font-weight-thin">Twitch</span><span class="indigo--text text--accent-2">Buddy</span></v-toolbar-title>
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
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-library-video',
          title: 'Clips',
          to: '/clips'
        },
        {
          icon: 'mdi-movie',
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
    text-shadow: -2px 2px #536DFE;
  }

  .foreground {
    position: fixed;
    z-index: 4;
  }
</style>
