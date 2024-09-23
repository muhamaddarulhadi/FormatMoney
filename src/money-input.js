/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 22/09/2024
    Version: 1.0
*/

import $ from 'jquery';
import { MoneyUtils } from './money-utils.js';

// Define the plugin
$.fn.formatMoneyInput = function(options) {
    // Default settings
    var settings = $.extend({
        decimalPlaces: 2
    }, options);

    // Regular expression for validating input
    const regex = new RegExp(`^-?\\d*(\\.\\d{0,${settings.decimalPlaces}})?$`);

    // Helper function to maintain cursor position
    function maintainCursorPosition(el, oldValue, newValue, oldCursorPos) {
        let oldLength = oldValue.length;
        let newLength = newValue.length;
        let lengthDifference = newLength - oldLength;
        let newCursorPos = oldCursorPos + lengthDifference;
        newCursorPos = Math.max(0, Math.min(newCursorPos, newLength));
        
        if (typeof el.setSelectionRange === "function") {
            el.setSelectionRange(newCursorPos, newCursorPos);
        }
    }

    // Apply formatting to each selected element
    return this.each(function() {
        var $input = $(this);

        // Remove spinner for number inputs (for WebKit browsers like Chrome, Safari)
        $input.css({
            '-webkit-appearance': 'none',
            // 'margin': '0',
            'padding': '0',
            'text-align': 'right',
            'padding-right': '10px'
        });
     

        // Handle input events to format value
        $input.on("input", function () {
            let value = $input.val(); // Get the input value
            let unformattedValue = MoneyUtils.removeCommas(value); // Remove any commas
            let cursorPosition = this.selectionStart; // Get current cursor position

            // If input is blank, do not format
            if (unformattedValue === "") {
                return; // Exit the function if input is blank
            }

            // Validate against the regular expression
            if (regex.test(unformattedValue)) {
                // Parse the value as a float and fix to 2 decimal places
                let formattedValue = MoneyUtils.addCommas(unformattedValue);

                // Set the formatted value in the input
                $input.val(formattedValue);

                // Maintain cursor position after formatting
                maintainCursorPosition(this, value, formattedValue, cursorPosition);
            }
        });

        // Keydown event to restrict invalid characters
        $input.on("keydown", function (e) {
            // Allow: backspace, delete, tab, escape, enter, and period (.)
            const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', '.', 'Home', 'End', ','
            ];

            if (allowedKeys.includes(e.key)) {
                return; // Allow the keypress event to proceed for valid keys
            }

            // If shift key is pressed or non-numeric characters (other than period) are pressed, prevent it
            if (e.shiftKey || (e.key < '0' || e.key > '9')) {
                e.preventDefault(); // Block invalid characters
            }
        });

        // On blur, force formatting to 2 decimal places or blank if empty
        $input.on("blur", function() {
            let value = MoneyUtils.removeCommas($input.val());
            if (value) {
                value = parseFloat(value).toFixed(settings.decimalPlaces);
                $input.val(MoneyUtils.addCommas(value));
            } else {
                $input.val(''); // Keep input blank if it's empty
            }
        });
    });
};