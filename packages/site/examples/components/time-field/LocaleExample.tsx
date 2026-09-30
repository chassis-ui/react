import { Time } from '@internationalized/date'
import { I18nProvider, TimeField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <I18nProvider locale="de-DE">
      <TimeField defaultValue={new Time(21, 30)} label="Beginn" />
    </I18nProvider>
    <I18nProvider locale="ar-EG">
      <div dir="rtl">
        <TimeField defaultValue={new Time(21, 30)} label="البداية" />
      </div>
    </I18nProvider>
  </>
)
