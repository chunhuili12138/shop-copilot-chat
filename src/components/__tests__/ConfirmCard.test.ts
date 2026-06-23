import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmCard from '../ConfirmCard.vue'

// Mock Element Plus components
vi.mock('@element-plus/icons-vue', () => ({
  WarningFilled: { template: '<span />' },
  Loading: { template: '<span />' },
}))

const defaultProps = {
  type: 'confirm' as const,
  title: '确认拒绝退款',
  message: '确定要拒绝猪八戒的退款申请吗？',
  details: {
    '顾客': '猪八戒',
    '退款金额': '¥24.90',
  },
  fields: [] as Array<{ name: string; type: 'input' | 'select' | 'textarea' | 'hidden' | 'multi_select'; label: string; required: boolean; placeholder?: string }>,
  buttons: [
    { type: 'confirm' as const, label: '确认拒绝' },
    { type: 'cancel' as const, label: '取消' },
  ],
  action: 'refund_reject',
  params: { shop_id: 5, refund_id: 6 },
}

describe('ConfirmCard', () => {
  it('renders title and message', () => {
    const wrapper = mount(ConfirmCard, {
      props: { confirmData: defaultProps },
    })

    expect(wrapper.text()).toContain('确认拒绝退款')
    expect(wrapper.text()).toContain('确定要拒绝猪八戒的退款申请吗？')
  })

  it('renders details', () => {
    const wrapper = mount(ConfirmCard, {
      props: { confirmData: defaultProps },
    })

    expect(wrapper.text()).toContain('顾客')
    expect(wrapper.text()).toContain('猪八戒')
    expect(wrapper.text()).toContain('退款金额')
    expect(wrapper.text()).toContain('¥24.90')
  })

  it('renders custom button labels', () => {
    const wrapper = mount(ConfirmCard, {
      props: { confirmData: defaultProps },
    })

    expect(wrapper.text()).toContain('确认拒绝')
    expect(wrapper.text()).toContain('取消')
  })

  it('renders input fields when fields are provided', () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { name: 'reason', type: 'input' as const, label: '拒绝理由', required: true, placeholder: '请输入拒绝原因' },
      ],
    }

    const wrapper = mount(ConfirmCard, {
      props: { confirmData: propsWithFields },
    })

    expect(wrapper.text()).toContain('拒绝理由')
  })

  it('emits confirm with false on cancel click', async () => {
    const wrapper = mount(ConfirmCard, {
      props: { confirmData: defaultProps },
    })

    const cancelBtn = wrapper.find('.cancel-btn')
    await cancelBtn.trigger('click')

    const emitted = wrapper.emitted('confirm')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe(false)
  })

  it('emits confirm with true on confirm click (no fields)', async () => {
    const wrapper = mount(ConfirmCard, {
      props: { confirmData: defaultProps },
    })

    const confirmBtn = wrapper.find('.confirm-btn')
    await confirmBtn.trigger('click')

    const emitted = wrapper.emitted('confirm')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe(true)
    expect(emitted![0][1]).toEqual({})
  })

  it('disables confirm button when required field is empty', () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { name: 'reason', type: 'input' as const, label: '拒绝理由', required: true },
      ],
    }

    const wrapper = mount(ConfirmCard, {
      props: { confirmData: propsWithFields },
    })

    const confirmBtn = wrapper.find('.confirm-btn')
    expect(confirmBtn.attributes('disabled')).toBeDefined()
  })
})
