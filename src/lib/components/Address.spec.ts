import {render, fireEvent, screen} from '@testing-library/svelte'
import Address from './Address.svelte'

it('shows proper text when rendered', () => {
  render(Address)
  const txt = screen.getByText('Send to')
  expect(txt).toBeInTheDocument()
})