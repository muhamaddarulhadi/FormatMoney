/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 12/02/2025
    Version: 1.4
*/

// import $ from 'jquery';  // COMMENT THIS IF YOU WANT TO PUBLISH ON PRODUCTION
import { MoneyUtils } from './money-utils.js';


// Define the plugin
$.fn.formatMoneyInput = function(options) {
    // Default settings
    var settings = $.extend({
        decimalPlaces: 2
    }, options);

    // Regular expression for validating input
    const regex = new RegExp(`^-?\\d*(\\.\\d{0,${settings.decimalPlaces}})?$`);
    const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', '.', 'Home', 'End', ',', '-'
    ];

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
        // let value = $input.val();

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

            // If input is blank or only contains a decimal point, do not format
            MoneyUtils.checkValueContainsOnly(unformattedValue)

            // Sanitize the pasted content by removing invalid characters
            let sanitizedValue = MoneyUtils.sanitizedValue(unformattedValue)

            // Validate against the regular expression
            if (regex.test(sanitizedValue)) {
                // Parse the value as a float and fix to 2 decimal places
                let formattedValue = MoneyUtils.addCommas(sanitizedValue);

                // Set the formatted value in the input
                $input.val(formattedValue);

                // Maintain cursor position after formatting
                maintainCursorPosition(this, value, formattedValue, cursorPosition);
            }
        });

        // Handle paste event to allow only valid characters
        $input.on("paste", function (e) {
            setTimeout(function() {
                // Retrieve pasted content from clipboard
                let pastedValue = $input.val();
                let unformattedValue = MoneyUtils.removeCommas(pastedValue); // Remove commas if any

                MoneyUtils.checkValueContainsOnly(unformattedValue)

                let sanitizedValue = MoneyUtils.sanitizedValue(unformattedValue)
            
                // Check if the sanitized value matches the regex
                if (regex.test(sanitizedValue)) {
                    // Format the sanitized value by adding commas
                    let formattedValue = MoneyUtils.addCommas(sanitizedValue);
                    // Update the input field with the formatted value
                    $input.val(formattedValue);
                }
            }, 0); // Delay to ensure paste action is completed
        });

        // work on Windows, Linux, and Mac and for copy paste event when capslock on or off
        $input.on("keydown", function (e) {
            // Detect copy (Cmd + C) and paste (Cmd + V) for both Mac and Windows/Linux
            const isPaste = (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V');
            const isCopy = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C');
        
            // Allow keys in allowedKeys, paste, copy, and negative symbol `-`
            if (allowedKeys.includes(e.key) || isPaste || isCopy) {
                // Allow `-` only at the start of the input (if cursor is at position 0)
                if (e.key === '-' && this.selectionStart !== 0) {
                    e.preventDefault(); // Prevent `-` if not at the start
                    return;
                }
        
                // Prevent multiple `-` signs after the first one at the start
                if (e.key === '-' && $input.val().includes('-') && this.selectionStart !== 0) {
                    e.preventDefault(); // Prevent if `-` is already present
                    return;
                }
        
                return; // Allow valid keys, paste, and copy
            }
        
            // If shift key is pressed or non-numeric characters (other than period) are pressed, prevent it
            if (e.shiftKey || (e.key < '0' || e.key > '9')) {
                e.preventDefault(); // Block invalid characters
            }
        });

        // On blur, force formatting to 2 decimal places or blank if empty
        $input.on("blur", function() {
            let value = MoneyUtils.removeCommas($input.val());
            if (value && !isNaN(value)) {
                value = parseFloat(value).toFixed(settings.decimalPlaces);
                $input.val(MoneyUtils.addCommas(value));
            } else {
                $input.val(''); // Keep input blank if it's empty
            }
        });
    });
};