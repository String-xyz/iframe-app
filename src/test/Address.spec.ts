import {render, screen} from '@testing-library/svelte'
import Address from '$lib/components/checkout/Address.svelte'

it('shows proper text when rendered', () => {
  render(Address)
  const txt = screen.getByText('Send to')
  expect(txt).toBeInTheDocument()
})