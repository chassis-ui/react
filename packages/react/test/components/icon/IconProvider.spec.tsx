import * as React from 'react'
import { render, screen, within } from '@testing-library/react'

import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem,
  CarouselPlayPause,
  Icon,
  IconComponentProps,
  IconProvider,
  Menu,
  MenuList,
  NavbarToggler,
  Notification,
  Pagination,
  Toast
} from '../../../src/index'

// The sprite reference lives on the `<use>` child, which no Testing Library query reaches.
// eslint-disable-next-line testing-library/no-node-access
const spriteHref = (svg: HTMLElement) => svg.querySelector('use')?.getAttribute('href')

// A consumer's own icon component, standing in for e.g. a Lucide/Heroicons wrapper: renders the
// name it was asked for into a test id, so each resolution path is observable without node access.
const NamedIcon = ({ name, ...props }: IconComponentProps) => (
  <i data-testid={`named-${name}`} {...props} />
)

const CustomSvg = (props: React.SVGAttributes<SVGSVGElement> & { 'data-testid': string }) => (
  <svg fill="none" viewBox="0 0 24 24" {...props} />
)

describe('Icon', () => {
  test('references a sprite embedded in the page by default', () => {
    render(<Icon data-testid="icon" name="check-solid" />)
    expect(spriteHref(screen.getByTestId('icon'))).toBe('#check-solid')
  })

  test.each([
    [32, '32px'],
    ['1.25rem', '1.25rem']
  ])('sets --cx-icon-size from size=%o, which chassis-css sizes icons by', (size, css) => {
    render(<Icon data-testid="icon" name="check-solid" size={size} />)
    const icon = screen.getByTestId('icon')
    expect(icon.style.getPropertyValue('--cx-icon-size')).toBe(css)
    expect(icon).toHaveAttribute('width', String(size))
  })

  test('leaves --cx-icon-size to the stylesheet without a size', () => {
    render(<Icon data-testid="icon" name="check-solid" />)
    const icon = screen.getByTestId('icon')
    expect(icon.style.getPropertyValue('--cx-icon-size')).toBe('')
    expect(icon).toHaveAttribute('width', '24')
  })

  test('sizes font glyphs too, and lets an explicit style win', () => {
    render(
      <Icon
        data-testid="icon"
        font
        name="check-solid"
        size={20}
        style={{ '--cx-icon-size': '2em' } as React.CSSProperties}
      />
    )
    expect(screen.getByTestId('icon').style.getPropertyValue('--cx-icon-size')).toBe('2em')
  })
})

describe('IconProvider', () => {
  test('sets the sprite, and an Icon of its own wins over it', () => {
    render(
      <IconProvider sprite="/icons.svg">
        <Icon data-testid="from-provider" name="check-solid" />
        <Icon data-testid="own" name="check-solid" sprite="/other.svg" />
      </IconProvider>
    )
    expect(spriteHref(screen.getByTestId('from-provider'))).toBe('/icons.svg#check-solid')
    expect(spriteHref(screen.getByTestId('own'))).toBe('/other.svg#check-solid')
  })

  test('adds its className to every Icon', () => {
    render(
      <IconProvider className="icon-adaptive">
        <Icon className="mine" data-testid="icon" name="check-solid" />
      </IconProvider>
    )
    expect(screen.getByTestId('icon')).toHaveClass('icon', 'icon-adaptive', 'mine')
  })

  test('switches Icons to font glyphs with a custom prefix', () => {
    render(
      <IconProvider font fontPrefix="my-">
        <Icon data-testid="icon" name="check-solid" />
      </IconProvider>
    )
    const icon = screen.getByTestId('icon')
    expect(icon.tagName).toBe('SPAN')
    expect(icon).toHaveClass('icon', 'my-check-solid')
  })

  test('extends the provider above it instead of replacing it', () => {
    render(
      <IconProvider component={NamedIcon} icons={{ previous: 'arrow-left', next: 'arrow-right' }}>
        <IconProvider icons={{ next: 'caret-right' }}>
          <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} />
        </IconProvider>
      </IconProvider>
    )
    expect(screen.getByTestId('named-arrow-left')).toBeInTheDocument()
    expect(screen.getByTestId('named-caret-right')).toBeInTheDocument()
  })
})

describe("the library's own icons", () => {
  test('default to the chassis-icons names, with outline chevrons on Pagination', () => {
    render(
      <IconProvider component={NamedIcon}>
        <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} />
        <NavbarToggler />
      </IconProvider>
    )
    expect(screen.getByTestId('named-chevron-left-outline')).toHaveClass('directional-icon')
    expect(screen.getByTestId('named-chevron-right-outline')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('named-bars-outline')).toHaveClass('navbar-toggler-icon')
  })

  test('render a mapped element with the class chassis-css positions it by, but not .icon', () => {
    render(
      <IconProvider icons={{ next: <CustomSvg data-testid="custom-next" className="lucide" /> }}>
        <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} />
      </IconProvider>
    )
    const icon = screen.getByTestId('custom-next')
    expect(icon).toHaveClass('lucide', 'directional-icon')
    // `.icon` sets `fill`, which would paint over an outline set's `fill="none"`.
    expect(icon).not.toHaveClass('icon')
    expect(icon).toHaveAttribute('fill', 'none')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  test('prefer a per-instance icon prop over the provider', () => {
    render(
      <IconProvider component={NamedIcon} icons={{ menu: 'grid' }}>
        <NavbarToggler icon={<CustomSvg data-testid="own-toggler" />} />
      </IconProvider>
    )
    expect(screen.getByTestId('own-toggler')).toHaveClass('navbar-toggler-icon')
    expect(screen.queryByTestId('named-grid')).not.toBeInTheDocument()
  })

  test('cover the carousel controls and play/pause toggle', () => {
    render(
      <IconProvider component={NamedIcon}>
        <Carousel>
          <CarouselControlPrev icon="arrow-left" />
          <CarouselControlNext />
          <CarouselPlayPause pauseIcon="stop" />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
          </CarouselInner>
        </Carousel>
      </IconProvider>
    )
    expect(screen.getByTestId('named-arrow-left')).toHaveClass('directional-icon')
    expect(screen.getByTestId('named-chevron-right-outline')).toHaveClass('directional-icon')
    expect(screen.getByTestId('named-stop')).toHaveClass('carousel-icon-pause')
    expect(screen.getByTestId('named-play-solid')).toHaveClass('carousel-icon-play')
  })

  test("cover a selected menu item's check", () => {
    render(
      <IconProvider icons={{ check: <CustomSvg data-testid="tick" /> }}>
        <Menu visible>
          <MenuList items={[{ id: 'a', label: 'Selected', selected: true }]} />
        </Menu>
      </IconProvider>
    )
    const item = screen.getByRole('menuitem', { name: 'Selected' })
    expect(within(item).getByTestId('tick')).toHaveClass('menu-item-check')
  })

  test("route Toast's and Notification's string icons through the provider's component", () => {
    render(
      <IconProvider component={NamedIcon}>
        <Toast icon="bell" title="Saved" visible />
        <Notification icon="info" text="Heads up" title="Note" visible />
      </IconProvider>
    )
    expect(screen.getByTestId('named-bell')).toHaveClass('toast-icon')
    expect(screen.getByTestId('named-info')).toHaveClass('notification-icon', 'align-self-start')
  })
})
