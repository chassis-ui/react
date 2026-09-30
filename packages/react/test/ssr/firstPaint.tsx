import React, { type ReactElement } from 'react'

// Cases for what a component renders on the server, beyond the stories: states no story shows,
// such as `Tabs` with no key given or an empty `DataGrid`. `render.spec.tsx` asserts on each
// one's server HTML, and `hydrate.spec.tsx` hydrates them with the stories.
//
// Loaded dynamically, like `loadStories`, so the hydration sweep can load the components again
// once it has installed a DOM.
export async function loadFirstPaintCases(): Promise<Record<string, () => ReactElement>> {
  const {
    Calendar,
    Carousel,
    CarouselIndicators,
    CarouselInner,
    CarouselItem,
    ChipInput,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridColumn,
    DataGridHeader,
    DataGridRow,
    Modal,
    ModalBody,
    ModalTitle,
    Menu,
    MenuItem,
    MenuList,
    MenuToggle,
    Notification,
    OtpInput,
    Popover,
    RangeCalendar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    TabList,
    TabPanel,
    Tabs,
    TextInput,
    Toast,
    Tooltip
  } = await import('../../src/index')
  const { today, getLocalTimeZone } = await import('@internationalized/date')

  const slides = (count: number) =>
    Array.from({ length: count }, (_, index) => (
      <CarouselItem key={index}>{`Slide ${index + 1}`}</CarouselItem>
    ))

  return {
    'Tabs with no key given': () => (
      <Tabs>
        <TabList aria-label="Tabs">
          <Tab id="one" disabled>
            One
          </Tab>
          <Tab id="two">Two</Tab>
        </TabList>
        <TabPanel id="one">Panel one</TabPanel>
        <TabPanel id="two">Panel two</TabPanel>
      </Tabs>
    ),
    'Tabs with every tab disabled': () => (
      <Tabs>
        <TabList aria-label="Tabs">
          <Tab id="one" disabled>
            One
          </Tab>
        </TabList>
        <TabPanel id="one">Panel one</TabPanel>
      </Tabs>
    ),
    'Modal rendered open': () => (
      <Modal backdrop={false} keyboard={false} open>
        <ModalTitle>Title</ModalTitle>
        <ModalBody>Body</ModalBody>
      </Modal>
    ),
    'Toast shown': () => <Toast autohide={false} defaultVisible message="Saved" />,
    'Notification shown': () => <Notification text="Saved" />,
    'Carousel with indicators': () => (
      <Carousel aria-label="Slides" defaultActiveIndex={1} ends="stop">
        <CarouselIndicators />
        <CarouselInner>{slides(3)}</CarouselInner>
      </Carousel>
    ),
    'Carousel inside a component of your own': () => {
      const Viewport = () => <CarouselInner>{slides(3)}</CarouselInner>
      return (
        <Carousel aria-label="Slides">
          <Viewport />
        </Carousel>
      )
    },
    'Carousel nested in a slide': () => {
      const Custom = () => <CarouselItem>Custom</CarouselItem>
      return (
        <Carousel aria-label="Outer">
          <CarouselInner>
            <CarouselItem>
              <Carousel aria-label="Inner" transition="fade">
                <CarouselInner>
                  <Custom />
                  <CarouselItem>Inner one</CarouselItem>
                </CarouselInner>
              </Carousel>
            </CarouselItem>
          </CarouselInner>
        </Carousel>
      )
    },
    'Carousel with fade': () => (
      <Carousel aria-label="Slides" transition="fade">
        <CarouselInner>
          <>{slides(2)}</>
        </CarouselInner>
      </Carousel>
    ),
    'Menu open': () => (
      <Menu defaultVisible>
        <MenuToggle>Actions</MenuToggle>
        <MenuList>
          <MenuItem>Edit</MenuItem>
        </MenuList>
      </Menu>
    ),
    'Calendar showing today': () => (
      <Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} />
    ),
    'RangeCalendar showing today': () => (
      <RangeCalendar
        aria-label="Dates"
        defaultValue={{ start: today(getLocalTimeZone()), end: today(getLocalTimeZone()) }}
      />
    ),
    'TextInput with help': () => <TextInput help="Your name" label="Name" />,
    'Table without descriptions': () => (
      <Table aria-label="People" selectionMode="multiple">
        <TableHeader>
          <TableColumn>Name</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="ada">
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
    'DataGrid empty': () => (
      <DataGrid aria-label="People" rowHeight={40}>
        {[
          <DataGridHeader key="header">
            <DataGridColumn isRowHeader>Name</DataGridColumn>
          </DataGridHeader>,
          <DataGridBody key="body" items={[] as { id: number }[]}>
            {() => (
              <DataGridRow>
                <DataGridCell>Nobody</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        ]}
      </DataGrid>
    ),
    'ChipInput empty': () => <ChipInput label="Tags" />,
    'OtpInput masked': () => <OtpInput aria-label="Code" length={4} mask />,
    'Popover open': () => (
      <Popover content="Details" defaultVisible>
        <button type="button">More</button>
      </Popover>
    ),
    'Tooltip open': () => (
      <Tooltip content="Hint" defaultVisible>
        <button type="button">Help</button>
      </Tooltip>
    )
  }
}
