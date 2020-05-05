<template>
  <v-card class="wrapper mb-4">
    <!-- CLIPS -->
    <template v-if="$route.name === 'clips'">
      <h4>Help</h4>
      <ol class="body-2">
        <li>Fill the channel field.</li>
        <li>Choose a timerange for your clip search.</li>
        <li>If no premade timerange suits you, select a custom one.</li>
        <li>Press the submit button and browse through the clip list.</li>
        <li>You can filter the list (by title, game or creator) using the keyword field.</li>
        <li>Click a clip to open the panel a watch and download it.</li>
        <li>Scroll down the list to load more clips up to a maximum of 1000 clips.</li>
      </ol>
      <br>
      <h4>Disclaimer</h4>
      <p
        class="body-2"
      >
        Due to Twitch's API limitations, only the first 1000 (at maximum, can be less) most viewed clips for given timerange can be displayed. If there is technicaly 2000 clips for the week timerange, you won't be able to see the last 1000. This count limitation does NOT includes keyword filtering. This filter is applied on top of the initial search. If only 3 clips are matching the keyword in the 1000 clips, and also 3 in the next 1000, you won't see the last ones as the clips below the top 1000 are not retrieved by the API. It's recommended to break down searches into smaller timeranges for accuracy using custom timerange.
      </p>
    </template>

    <!-- REPLAYSYNC -->
    <template v-if="$route.name === 'replaysync'">
      <h4>Help</h4>
      <h5>Search replays</h5>
      <ol class="ml-2 body-2">
        <li>Add up to 4 channels.</li>
        <li>Find one replay from the lists you would like to watch.</li>
        <li>Click it to filter out non-simultaneous replays and set it as a sync reference.</li>
        <li>Press the "Play" button to get into the Sync Player.</li>
      </ol>
      <br>
      <h5>Watch replays</h5>
      <ol class="ml-2 body-2">
        <li>
          Once in the player, hover the
          <v-btn fab class="small-btn">
            <v-icon small>
              mdi-plus
            </v-icon>
          </v-btn>&nbsp;button to display the player controls.
        </li>
        <li>
          Press the
          <v-btn fab class="small-btn">
            <v-icon small>
              mdi-play
            </v-icon>
          </v-btn>&nbsp;button to start watching all replays and perform an initial sync.
        </li>
        <li>
          Press the
          <v-btn fab class="small-btn">
            <v-icon small>
              mdi-sync
            </v-icon>
          </v-btn>&nbsp;button to re-sync if needed.
        </li>
        <li>Select the reference player using the buttons below the playback controls.</li>
      </ol>
      <br>
      <h4>Disclaimer</h4>
      <ul class="body-2 text-justify">
        <li>In the replays list, select only one replay to set it as reference. In the case of another channel having several replays available on the timerange, the first one of the list will be sent to the Sync Player. If the first of the list is not the one you want to watch, you can select one of them as initial reference.</li>
        <li>This tool is not able yet to handle potential delay from a past broadcast. This means that you will probably experience a little delay between channels even after syncing. Also note that in some case (mainly broadcast partial crash), the timestamps used for syncing will be screwed-up and the sync controler won't be able to sync them back.</li>
        <li>Using default twitch player controls (except for volumes) can break the sync controller behing the scene. For a better experience, avoid using them.</li>
      </ul>
    </template>
  </v-card>
</template>

<style lang="scss" scoped>
.wrapper {
  padding: 3rem;

  .small-btn {
    height: 1.5rem;
    width: 1.5rem;
    background: #555555 !important;
  }
}
@media screen and (max-width: 600px) {
  .wrapper {
    padding: 1rem;
  }
}
</style>
