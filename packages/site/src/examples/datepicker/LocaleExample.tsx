import { CxDatePicker, I18nProvider } from '@chassis-ui/react'

// `ar-SA` uses the Umm al-Qura calendar (non-Gregorian) and reads right-to-left — both the
// segment order and the calendar grid adapt automatically, sourced from `@internationalized/date`
// rather than hand-rolled locale logic.
export const LocaleExample = () => {
  return (
    <I18nProvider locale="ar-SA">
      <div dir="rtl">
        <CxDatePicker aria-label="تاريخ الحدث" />
      </div>
    </I18nProvider>
  )
}
