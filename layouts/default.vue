<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      temporary
      app
    >
      <v-list>
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
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title><span class="grey--text text--lighten-2 font-weight-thin">Twitch</span><span class="purple--text text--accent-1">Buddy</span></v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer
      app
    >
      <span><span>Twitch</span><span class=" purple--text text--accent-1">Buddy</span>  <small>&copy; 2020</small></span><v-spacer />
      <small>by <a href="https://twitter.com/pedraalfr" class="blue--text text--accent-1">Pedraal</a></small>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data () {
    return {
      clipped: true,
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
    text-shadow: -2px 3px #E040FB;
  }
</style>
