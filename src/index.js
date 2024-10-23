/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 23/10/2024
    Version: 1.1
*/

import $ from 'jquery'; // COMMENT THIS IF YOU WANT TO PUBLISH ON PRODUCTION
import './money-input.js';
import './money-formatter.js';

// Optionally, you can log to confirm it's loaded
// console.log('FormatMoney plugin loaded');

// COMMENT THIS IF YOU WANT TO PUBLISH
// EXAMPLE TO RUN
$(function () {
    $('.double-input').formatMoneyInput({
        decimalPlaces: 2
    });
});