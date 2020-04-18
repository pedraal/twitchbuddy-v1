<template>
  <v-row align="center" justify="center" style="min-height: 80vh;">
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="5"
      class="text-center text-md-left"
    >
      <h2 class="display-1 font-weight-bold">
        Welcome on
      </h2>
      <h1 class="display-3 font-weight-bold">
        TwitchBuddy
      </h1>
      <p class="body-1 font-weight-thin my-1">
        Designed to bring your twitch videomaking to the next level.
      </p>
      <p class="headline mt-2 mb-0">
        Enjoy enhanced clip hunting and multi replay in sync experience using our tools.
      </p>
    </v-col>
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="5"
    >
      <v-row justify="center">
        <v-col v-for="item in items" :key="item.title" cols="12" class="ma-4">
          <v-card>
            <v-card-title>
              <h2 class="mx-auto headline">
                <v-icon class="mb-1">
                  {{ item.icon }}
                </v-icon>&nbsp;{{ item.title }}
              </h2>
            </v-card-title>
            <v-card-text class="pa-4 text-justify">
              {{ item.content }}
            </v-card-text>
            <v-card-actions class="text-center">
              <v-badge
                class="d-block mx-auto"
                color="error"
                icon="mdi-lock"
              >
                <template v-if="item.badge" v-slot:badge>
                  <span class="px-1 overline">{{ item.badge }}</span>
                </template>
                <v-btn
                  :to="item.link"
                  nuxt
                  class="mx-auto mb-4"
                  color="indigo accent-1"
                  outlined
                >
                  {{ item.action }}
                </v-btn>
              </v-badge>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  transition: 'page',
  data () {
    return {
      items: [
        {
          title: 'Clips',
          icon: 'mdi-movie-open-outline',
          content: "The clip tool lets you search precisely for twitch clips using Twitch's API. Discover top twitchs moment or check out for the best clips for your videos and download them directly from this app.",
          link: '/clips',
          action: 'Get started',
          badge: false
        },
        {
          title: 'Replay sync',
          icon: 'mdi-filmstrip',
          content: 'The replay sync lets you watch group streams just like if it was live!  Submit a list of channels, find simultaneous broacasts and bring them to our synchronising player.',
          link: '/replaysync',
          action: 'Get started',
          badge: 'beta'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-shadow: -3px 4px #536dfe;
  }

  .v-card .v-card__title .v-icon {
    text-shadow: -2px 3px #536dfe;
  }
</style>
