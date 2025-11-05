import React from 'react'
import { render, screen } from '../../../../../../test-mocks/testing-library-react'
import { WorkstationLayout } from '../WorkstationLayout'

test('WorkstationLayout renders sidebar, main and insights areas', () => {
  render(
    <WorkstationLayout
      sidebar={<div data-testid="custom-sidebar">Sidebar</div>}
      main={<main>My Main Content</main>}
      insights={<aside>Insights</aside>}
    />
  )

  // Sidebar has a dedicated test id in the implementation
  const sidebar = screen.getByTestId('workstation-sidebar')
  expect(sidebar).toBeTruthy()

  // Main region should be discoverable by role
  const main = screen.getByRole('main')
  expect(main).toBeTruthy()

  // Insights panel should render its title text
  const rendered = (globalThis as any).__renderedHtml || ''
  expect(rendered.toLowerCase()).toContain('insights')
})
