<template>
  <v-text-field
    v-model="value.keyword"
    :label="$t('clips.keyword')"
    name="keyword"
    outlined
    dense
    rounded
    hide-details
  />
</template>

<script>
export default {
  name: 'ClipFilter',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    }
  },
  watch: {
    value () {
      this.$emit('input', this.value)
    }
  }

}
</script>
