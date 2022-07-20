/*
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from './store'
import App2 from './App2'
*/
import { Provider } from 'react-redux'
import { setupStore } from '../store'



import React from 'react'
//import { rest } from 'msw'
//import { setupServer } from 'msw/node'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'
import renderer from 'react-test-renderer'
// We're using our own custom render function and not RTL's render.
//import { renderWithProviders } from './utils/test-utils'
//import App2 from '../App2'
import NavLinkItem from '../components/NavLinkItem'

// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
// export const handlers = [
//   rest.get('/api/user', (req, res, ctx) => {
//     return res(ctx.json('John Smith'), ctx.delay(150))
//   })
// ]

//const server = setupServer(...handlers)

// Enable API mocking before tests.
//beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
//afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
//afterAll(() => server.close())

test('testing the entire App', async () => {
  //const a = renderWithProviders(<App2 />)
  const a = renderer.create(
    <Provider store={setupStore({})}>
      <NavLinkItem item={{title: 'Home', content: 'home'}} />
    </Provider>
  )

  await waitFor(() => {
    expect(a).toMatchSnapshot()
  })

  // should show no user initially, and not be fetching a user
  //expect(screen.getByText(/no user/i)).toBeInTheDocument()
  //expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()

  // after clicking the 'Fetch user' button, it should now show that it is fetching the user
  //fireEvent.click(screen.getByRole('button', { name: /Fetch user/i }))
  //expect(screen.getByText(/no user/i)).toBeInTheDocument()

  // after some time, the user should be received
  //expect(await screen.findByText(/John Smith/i)).toBeInTheDocument()
  //expect(screen.queryByText(/no user/i)).not.toBeInTheDocument()
  //expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()
})
