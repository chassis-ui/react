import type { useLocalizedStringFormatter } from 'react-aria'

// react-aria's own strings for the cell labels `useCalendarCell` writes (react-aria 3.52.1,
// `intl/calendar/*.json`, Apache-2.0), limited to the ones `useCellToday` reads: the "Today" and
// "selected" wrappers, and the minimum/maximum date notes. The locales and their order are
// react-aria's, so a locale it doesn't have falls back to the same one here.
// `test/components/calendar/todayLabel.spec.tsx` compares the labels against react-aria's
// `react-aria/i18n` strings in every locale, so a react-aria update that changes them fails there.
export const todayLabelStrings: Parameters<typeof useLocalizedStringFormatter>[0] = {
  'ar-AE': {
    todayDate: (args) => `اليوم، ${args?.date}`,
    todayDateSelected: (args) => `اليوم، ${args?.date} محدد`,
    dateSelected: (args) => `${args?.date} المحدد`,
    minimumDate: `أول تاريخ متاح`,
    maximumDate: `آخر تاريخ متاح`
  },
  'bg-BG': {
    todayDate: (args) => `Днес, ${args?.date}`,
    todayDateSelected: (args) => `Днес, ${args?.date} са избрани`,
    dateSelected: (args) => `Избрано е ${args?.date}`,
    minimumDate: `Първа налична дата`,
    maximumDate: `Последна налична дата`
  },
  'cs-CZ': {
    todayDate: (args) => `Dnes, ${args?.date}`,
    todayDateSelected: (args) => `Dnes, vybráno ${args?.date}`,
    dateSelected: (args) => `Vybráno ${args?.date}`,
    minimumDate: `První dostupné datum`,
    maximumDate: `Poslední dostupné datum`
  },
  'da-DK': {
    todayDate: (args) => `I dag, ${args?.date}`,
    todayDateSelected: (args) => `I dag, ${args?.date} valgt`,
    dateSelected: (args) => `${args?.date} valgt`,
    minimumDate: `Første ledige dato`,
    maximumDate: `Sidste ledige dato`
  },
  'de-DE': {
    todayDate: (args) => `Heute, ${args?.date}`,
    todayDateSelected: (args) => `Heute, ${args?.date} ausgewählt`,
    dateSelected: (args) => `${args?.date} ausgewählt`,
    minimumDate: `Erstes verfügbares Datum`,
    maximumDate: `Letztes verfügbares Datum`
  },
  'el-GR': {
    todayDate: (args) => `Σήμερα, ${args?.date}`,
    todayDateSelected: (args) => `Σήμερα, επιλέχτηκε ${args?.date}`,
    dateSelected: (args) => `Επιλέχθηκε ${args?.date}`,
    minimumDate: `Πρώτη διαθέσιμη ημερομηνία`,
    maximumDate: `Τελευταία διαθέσιμη ημερομηνία`
  },
  'en-US': {
    todayDate: (args) => `Today, ${args?.date}`,
    todayDateSelected: (args) => `Today, ${args?.date} selected`,
    dateSelected: (args) => `${args?.date} selected`,
    minimumDate: `First available date`,
    maximumDate: `Last available date`
  },
  'es-ES': {
    todayDate: (args) => `Hoy, ${args?.date}`,
    todayDateSelected: (args) => `Hoy, ${args?.date} seleccionado`,
    dateSelected: (args) => `${args?.date} seleccionado`,
    minimumDate: `Primera fecha disponible`,
    maximumDate: `Última fecha disponible`
  },
  'et-EE': {
    todayDate: (args) => `Täna, ${args?.date}`,
    todayDateSelected: (args) => `Täna, ${args?.date} valitud`,
    dateSelected: (args) => `${args?.date} valitud`,
    minimumDate: `Esimene saadaolev kuupäev`,
    maximumDate: `Viimane saadaolev kuupäev`
  },
  'fi-FI': {
    todayDate: (args) => `Tänään, ${args?.date}`,
    todayDateSelected: (args) => `Tänään, ${args?.date} valittu`,
    dateSelected: (args) => `${args?.date} valittu`,
    minimumDate: `Ensimmäinen varattavissa oleva päivämäärä`,
    maximumDate: `Viimeinen varattavissa oleva päivämäärä`
  },
  'fr-FR': {
    todayDate: (args) => `Aujourd'hui, ${args?.date}`,
    todayDateSelected: (args) => `Aujourd’hui, ${args?.date} sélectionné`,
    dateSelected: (args) => `${args?.date} sélectionné`,
    minimumDate: `Première date disponible`,
    maximumDate: `Dernière date disponible`
  },
  'he-IL': {
    todayDate: (args) => `היום, ${args?.date}`,
    todayDateSelected: (args) => `היום, ${args?.date} נבחר`,
    dateSelected: (args) => `${args?.date} נבחר`,
    minimumDate: `תאריך פנוי ראשון`,
    maximumDate: `תאריך פנוי אחרון`
  },
  'hr-HR': {
    todayDate: (args) => `Danas, ${args?.date}`,
    todayDateSelected: (args) => `Danas, odabran ${args?.date}`,
    dateSelected: (args) => `${args?.date} odabran`,
    minimumDate: `Prvi raspoloživi datum`,
    maximumDate: `Posljednji raspoloživi datum`
  },
  'hu-HU': {
    todayDate: (args) => `Ma, ${args?.date}`,
    todayDateSelected: (args) => `Ma, ${args?.date} kijelölve`,
    dateSelected: (args) => `${args?.date} kiválasztva`,
    minimumDate: `Az első elérhető dátum`,
    maximumDate: `Utolsó elérhető dátum`
  },
  'it-IT': {
    todayDate: (args) => `Oggi, ${args?.date}`,
    todayDateSelected: (args) => `Oggi, ${args?.date} selezionata`,
    dateSelected: (args) => `${args?.date} selezionata`,
    minimumDate: `Prima data disponibile`,
    maximumDate: `Ultima data disponibile`
  },
  'ja-JP': {
    todayDate: (args) => `本日、${args?.date}`,
    todayDateSelected: (args) => `本日、${args?.date} を選択`,
    dateSelected: (args) => `${args?.date} を選択`,
    minimumDate: `最初の利用可能日`,
    maximumDate: `最終利用可能日`
  },
  'ko-KR': {
    todayDate: (args) => `오늘, ${args?.date}`,
    todayDateSelected: (args) => `오늘, ${args?.date} 선택됨`,
    dateSelected: (args) => `${args?.date} 선택됨`,
    minimumDate: `처음으로 사용 가능한 일자`,
    maximumDate: `마지막으로 사용 가능한 일자`
  },
  'lt-LT': {
    todayDate: (args) => `Šiandien, ${args?.date}`,
    todayDateSelected: (args) => `Šiandien, pasirinkta ${args?.date}`,
    dateSelected: (args) => `Pasirinkta ${args?.date}`,
    minimumDate: `Pirmoji galima data`,
    maximumDate: `Paskutinė galima data`
  },
  'lv-LV': {
    todayDate: (args) => `Šodien, ${args?.date}`,
    todayDateSelected: (args) => `Atlasīta šodiena, ${args?.date}`,
    dateSelected: (args) => `Atlasīts: ${args?.date}`,
    minimumDate: `Pirmais pieejamais datums`,
    maximumDate: `Pēdējais pieejamais datums`
  },
  'nb-NO': {
    todayDate: (args) => `I dag, ${args?.date}`,
    todayDateSelected: (args) => `I dag, ${args?.date} valgt`,
    dateSelected: (args) => `${args?.date} valgt`,
    minimumDate: `Første tilgjengelige dato`,
    maximumDate: `Siste tilgjengelige dato`
  },
  'nl-NL': {
    todayDate: (args) => `Vandaag, ${args?.date}`,
    todayDateSelected: (args) => `Vandaag, ${args?.date} geselecteerd`,
    dateSelected: (args) => `${args?.date} geselecteerd`,
    minimumDate: `Eerste beschikbare datum`,
    maximumDate: `Laatste beschikbare datum`
  },
  'pl-PL': {
    todayDate: (args) => `Dzisiaj, ${args?.date}`,
    todayDateSelected: (args) => `Dzisiaj wybrano ${args?.date}`,
    dateSelected: (args) => `Wybrano ${args?.date}`,
    minimumDate: `Pierwsza dostępna data`,
    maximumDate: `Ostatnia dostępna data`
  },
  'pt-BR': {
    todayDate: (args) => `Hoje, ${args?.date}`,
    todayDateSelected: (args) => `Hoje, ${args?.date} selecionado`,
    dateSelected: (args) => `${args?.date} selecionado`,
    minimumDate: `Primeira data disponível`,
    maximumDate: `Última data disponível`
  },
  'pt-PT': {
    todayDate: (args) => `Hoje, ${args?.date}`,
    todayDateSelected: (args) => `Hoje, ${args?.date} selecionado`,
    dateSelected: (args) => `${args?.date} selecionado`,
    minimumDate: `Primeira data disponível`,
    maximumDate: `Última data disponível`
  },
  'ro-RO': {
    todayDate: (args) => `Astăzi, ${args?.date}`,
    todayDateSelected: (args) => `Azi, ${args?.date} selectată`,
    dateSelected: (args) => `${args?.date} selectată`,
    minimumDate: `Prima dată disponibilă`,
    maximumDate: `Ultima dată disponibilă`
  },
  'ru-RU': {
    todayDate: (args) => `Сегодня, ${args?.date}`,
    todayDateSelected: (args) => `Сегодня, выбрано ${args?.date}`,
    dateSelected: (args) => `Выбрано ${args?.date}`,
    minimumDate: `Первая доступная дата`,
    maximumDate: `Последняя доступная дата`
  },
  'sk-SK': {
    todayDate: (args) => `Dnes ${args?.date}`,
    todayDateSelected: (args) => `Vybratý dnešný dátum ${args?.date}`,
    dateSelected: (args) => `Vybratý dátum ${args?.date}`,
    minimumDate: `Prvý dostupný dátum`,
    maximumDate: `Posledný dostupný dátum`
  },
  'sl-SI': {
    todayDate: (args) => `Danes, ${args?.date}`,
    todayDateSelected: (args) => `Danes, ${args?.date} izbrano`,
    dateSelected: (args) => `${args?.date} izbrano`,
    minimumDate: `Prvi razpoložljivi datum`,
    maximumDate: `Zadnji razpoložljivi datum`
  },
  'sr-SP': {
    todayDate: (args) => `Danas, ${args?.date}`,
    todayDateSelected: (args) => `Danas, izabran ${args?.date}`,
    dateSelected: (args) => `${args?.date} izabran`,
    minimumDate: `Prvi raspoloživi datum`,
    maximumDate: `Zadnji raspoloživi datum`
  },
  'sv-SE': {
    todayDate: (args) => `Idag, ${args?.date}`,
    todayDateSelected: (args) => `Idag, ${args?.date} har valts`,
    dateSelected: (args) => `${args?.date} har valts`,
    minimumDate: `Första tillgängliga datum`,
    maximumDate: `Sista tillgängliga datum`
  },
  'tr-TR': {
    todayDate: (args) => `Bugün, ${args?.date}`,
    todayDateSelected: (args) => `Bugün, ${args?.date} seçildi`,
    dateSelected: (args) => `${args?.date} seçildi`,
    minimumDate: `İlk müsait tarih`,
    maximumDate: `Son müsait tarih`
  },
  'uk-UA': {
    todayDate: (args) => `Сьогодні, ${args?.date}`,
    todayDateSelected: (args) => `Сьогодні, вибрано ${args?.date}`,
    dateSelected: (args) => `Вибрано ${args?.date}`,
    minimumDate: `Перша доступна дата`,
    maximumDate: `Остання доступна дата`
  },
  'zh-CN': {
    todayDate: (args) => `今天，即 ${args?.date}`,
    todayDateSelected: (args) => `已选择今天，即 ${args?.date}`,
    dateSelected: (args) => `已选择 ${args?.date}`,
    minimumDate: `第一个可用日期`,
    maximumDate: `最后一个可用日期`
  },
  'zh-TW': {
    todayDate: (args) => `今天，${args?.date}`,
    todayDateSelected: (args) => `已選取今天，${args?.date}`,
    dateSelected: (args) => `已選取 ${args?.date}`,
    minimumDate: `第一個可用日期`,
    maximumDate: `最後一個可用日期`
  }
}
