<template>
  <v-card class="wrapper mb-4">
    <!-- CLIPS -->
    <template v-if="['clips', 'lang-clips'].includes($route.name)">
      <h4>{{ $t('clips.help.title') }}</h4>
      <ol class="body-2">
        <li v-for="(item,id) in $t('clips.help.steps')" :key="id">
          {{ item }}
        </li>
      </ol>
      <br>
      <h4>{{ $t('clips.help.disclaimer.title') }}</h4>
      <p
        class="body-2"
      >
        {{ $t('clips.help.disclaimer.text') }}
      </p>
    </template>

    <!-- REPLAYSYNC -->
    <template v-if="['replaysync', 'lang-replaysync'].includes($route.name)">
      <h4>{{ $t('replaysync.help.title') }}</h4>
      <h5>{{ $t('replaysync.help.subtitle1') }}</h5>
      <ol class="ml-2 body-2">
        <li v-for="(item,id) in $t('replaysync.help.steps1')" :key="id">
          {{ item }}
        </li>
      </ol>
      <br>
      <h5>{{ $t('replaysync.help.subtitle2') }}</h5>
      <ol class="ml-2 body-2">
        <li v-for="(item,id) in $t('replaysync.help.steps2')" :key="id">
          <i18n :path="`replaysync.help.steps2.${id}.text`">
            <v-btn fab class="small-btn">
              <v-icon small>
                {{ $t(`replaysync.help.steps2.${id}.icon`) }}
              </v-icon>
            </v-btn>
          </i18n>
        </li>
      </ol>
      <br>
      <h4>{{ $t('replaysync.help.disclaimer.title') }}</h4>
      <ul class="body-2 text-justify">
        <li v-for="(item,id) in $t('replaysync.help.disclaimer.texts')" :key="id">
          {{ item }}
        </li>
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
