import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

import $ from 'jquery';
import _ from 'lodash';
import Dropzone from 'dropzone';
import noUiSlider from 'nouislider';
import DataTable from 'datatables.net';
import { Calendar } from 'vanilla-calendar-pro';

window.$ = $;
window.jQuery = $;
window._ = _;
window.Dropzone = Dropzone;
window.noUiSlider = noUiSlider;
window.DataTable = DataTable;
window.VanillaCalendarPro = Calendar;

import('preline').then(() => {
  createRoot(document.getElementById('root-container')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
