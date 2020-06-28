import Vuetify from 'vuetify'

import { mount, createLocalVue } from '@vue/test-utils'
import ClipFilter from './ClipFilter'

const localVue = createLocalVue()

const $t = () => {}

describe('ClipFilter', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('is a Vue instance', () => {
    const wrapper = mount(ClipFilter, { localVue, vuetify, mocks: { $t }, propsData: { value: { keyword: '' } } })
    expect(wrapper.vm).toBeTruthy()
  })

  test('renders correctly', () => {
    const wrapper = mount(ClipFilter, { localVue, vuetify, mocks: { $t }, propsData: { value: { keyword: '' } } })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit an event when the field is updated', () => {
    const wrapper = mount(ClipFilter, { localVue, vuetify, mocks: { $t }, propsData: { value: { keyword: '' } } })

    const event = jest.fn()
    const field = wrapper.find('.v-text-field')

    // Here we bind a listener to the wrapper
    // instance to catch our custom event
    // https://vuejs.org/v2/api/#Instance-Methods-Events
    wrapper.vm.$on('input', event)

    expect(event).toHaveBeenCalledTimes(0)

    // Simulate an input on the field
    field.vm.$emit('input', 'some value')

    // Ensure that our mock event was called
    expect(event).toHaveBeenCalledTimes(1)
  })
})
