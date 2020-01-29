<template>
  <v-row align="center" justify="center">
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="5"
    >
      <h2 class="display-1 font-weight-bold">
        Welcome on
      </h2>
      <h1 class="display-3 font-weight-bold">
        TwitchBuddy
      </h1>
      <p class="headline mt-2 mb-0">
        Enjoy an enhanced clip hunting and multi replay viewing experience using our tools.
      </p>
      <p class="headline font-weight-thin my-0">
        Designed to bring your twitch content videomaking workflow to the next level.
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
            <v-card-actions>
              <v-btn
                :to="item.link"
                nuxt
                class="mx-auto mb-4"
                color="purple accent-1"
                outlined
              >
                {{ item.action }}
              </v-btn>
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
          icon: 'mdi-library-video',
          content: "The clip tool lets you search precisely for twitch clips using Twitch's API. Discover top twitchs moment or check out for the best clips for your videos and download them directly from this app.",
          link: '/clips',
          action: 'Get started'
        },
        {
          title: 'Replay sync',
          icon: 'mdi-movie',
          content: 'The replay sync lets you watch group streams just like if it was live!  Submit a list of channels, find simultaneous broacasts and bring them to our synchronising player.',
          link: '/replaysync',
          action: 'Coming soon'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-shadow: -3px 4px #E040FB;
  }

  .v-card .v-card__title .v-icon {
    text-shadow: -2px 3px #E040FB;
  }
</style>
