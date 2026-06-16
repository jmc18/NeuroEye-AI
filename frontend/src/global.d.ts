import type { JQueryStatic } from 'jquery'
import type _ from 'lodash'
import type Dropzone from 'dropzone'
import type noUiSlider from 'nouislider'
import type DataTables from 'datatables.net'
import type { Calendar } from 'vanilla-calendar-pro'

declare global {
  interface Window {
    $: JQueryStatic
    jQuery: JQueryStatic
    _: typeof _
    Dropzone: typeof Dropzone
    noUiSlider: typeof noUiSlider
    DataTable: typeof DataTables
    VanillaCalendarPro: typeof Calendar
    HSStaticMethods: {
      autoInit: (collection?: string[]) => void
    }
  }
}

export {}