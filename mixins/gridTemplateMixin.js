import { mapGetters } from 'vuex'
const gridTemplate = {
  computed: {
    ...mapGetters('videos', ['collections']),
    gridTemplate () {
      if (this.collections.length >= 4) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1 gridItem2" "gridItem3 gridItem4"'
        }
      }
      if (this.collections.length >= 3) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1 gridItem2" "gridItem3 gridItem3"'
        }
      }
      if (this.collections.length === 2) {
        return {
          gridTemplateColumns: '100%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1" "gridItem2"'
        }
      }
      return {
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto',
        gridTemplateAreas: '"gridItem1"'
      }
    }
  }
}

export default gridTemplate