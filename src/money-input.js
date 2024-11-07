/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 07/11/2024
    Version: 1.3
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
    // const regex = new RegExp(`^-?\\d*[.]?\\d{0,${settings.decimalPlaces}}$`)
    // const regex = new RegExp(`^\\d*(\\.\\d{0,${settings.decimalPlaces}})?$`);

    // const defaultOptions = {
    //     decimalPlaces: 2
    // };

    // const settings = $.extend({}, defaultOptions, options);

    // // Helper function to add commas
    // function addCommas(num) {
    //     num = num.toString();
        
    //     if (num.includes('.')) {
    //         let parts = num.split(".");
    //         parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //         return parts.join(".");
    //     } else {
    //         return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     }
    // }

    // // Helper function to remove commas
    // function removeCommas(num) {
    //     // Convert num to a string and check if it contains commas
    //     if (typeof num === 'string' && num.includes(',')) {
    //         return num.replace(/,/g, '');
    //     }
    
    //     // If num is not a string, convert it to a string and handle it
    //     if (typeof num !== 'string') {
    //         num = num.toString();
    //     }
    
    //     return num.replace(/,/g, ''); // If no commas, this will simply return the string as is
    // }

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

            // // If input is blank or only contains a decimal point, do not format
            // if (unformattedValue === "" || unformattedValue === "." || unformattedValue === "-") {
            //     return; // Exit the function if input is blank, only ".", or "-"
            // }

            MoneyUtils.checkValueContainsOnly(unformattedValue)

            // // Sanitize the pasted content by removing invalid characters
            // let sanitizedValue = unformattedValue.replace(/[^0-9\.\-]/g, ''); // Allow only digits, decimal point, and negative sign
            
            // // Ensure only one `-` at the start and only one decimal point
            // if (sanitizedValue.indexOf('-') > 0) sanitizedValue = sanitizedValue.replace('-', ''); // Remove `-` if not at the start
            // let decimalIndex = sanitizedValue.indexOf('.');
            // if (decimalIndex !== -1) {
            //     sanitizedValue = sanitizedValue.slice(0, decimalIndex + 1) + sanitizedValue.slice(decimalIndex + 1).replace(/\./g, ''); // Keep only one decimal point
            // }

            let sanitizedValue = MoneyUtils.sanitizedValue(unformattedValue)

            // Validate against the regular expression
            if (regex.test(sanitizedValue)) {
                // Parse the value as a float and fix to 2 decimal places
                // let floatValue = parseFloat(unformattedValue) || 0;
                // let fixedValue = floatValue.toFixed(settings.decimalPlaces);
                // let formattedValue = addCommas(fixedValue);
                let formattedValue = MoneyUtils.addCommas(sanitizedValue);

                // Set the formatted value in the input
                $input.val(formattedValue);

                // Maintain cursor position after formatting
                maintainCursorPosition(this, value, formattedValue, cursorPosition);
            }
        });

        // // Handle input events to format value
        // $input.on("input", function() {
        //     let value = $input.val(); // Get the input value
        //     let unformattedValue = MoneyUtils.removeCommas(value); // Remove any commas
        //     let cursorPosition = this.selectionStart; // Get current cursor position

        //     // If input is blank, do not format
        //     if (unformattedValue === "") {
        //         return; // Exit the function if input is blank
        //     }

        //     // Validate the input to ensure up to 2 decimal places
        //     let isValid = /^-?\d*[.]?\d{0,2}$/.test(unformattedValue);

        //     if (isValid) {
        //         // Parse the value as a float and fix to 2 decimal places
        //         // let floatValue = parseFloat(unformattedValue) || 0;
        //         // let fixedValue = floatValue.toFixed(settings.decimalPlaces);
        //         // let formattedValue = addCommas(fixedValue);
        //         let formattedValue = MoneyUtils.addCommas(unformattedValue);

        //         // Set the formatted value in the input
        //         $input.val(formattedValue);

        //         // Maintain cursor position after formatting
        //         maintainCursorPosition(this, value, formattedValue, cursorPosition);
        //     }
        // });

        // Handle paste event
        // $input.on("paste", function () {
        //     setTimeout(function() {
        //         let pastedValue = $input.val();
        //         let unformattedValue = MoneyUtils.removeCommas(pastedValue);
        //         if (regex.test(unformattedValue)) {
        //             let formattedValue = MoneyUtils.addCommas(unformattedValue);
        //             $input.val(formattedValue);
        //         }
        //     }, 0); // Delay to ensure paste action is completed
        // });

        // Handle paste event to allow only valid characters
        $input.on("paste", function (e) {
            setTimeout(function() {
                // Retrieve pasted content from clipboard
                let pastedValue = $input.val();
                let unformattedValue = MoneyUtils.removeCommas(pastedValue); // Remove commas if any

                // // If input is blank or only contains a decimal point, do not format
                // if (unformattedValue === "" || unformattedValue === "." || unformattedValue === "-") {
                //     return; // Exit the function if input is blank, only ".", or "-"
                // }

                MoneyUtils.checkValueContainsOnly(unformattedValue)
            
                // // Sanitize the pasted content by removing invalid characters
                // let sanitizedValue = unformattedValue.replace(/[^0-9\.\-]/g, ''); // Allow only digits, decimal point, and negative sign
            
                // // Ensure only one `-` at the start and only one decimal point
                // if (sanitizedValue.indexOf('-') > 0) sanitizedValue = sanitizedValue.replace('-', ''); // Remove `-` if not at the start
                // let decimalIndex = sanitizedValue.indexOf('.');
                // if (decimalIndex !== -1) {
                //     sanitizedValue = sanitizedValue.slice(0, decimalIndex + 1) + sanitizedValue.slice(decimalIndex + 1).replace(/\./g, ''); // Keep only one decimal point
                // }

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

        // // Keydown event to restrict invalid characters
        // $input.on("keydown", function (e) {

        //     // console.log(e.key)
        //     // // Allow: backspace, delete, tab, escape, enter, and period (.)
        //     // const allowedKeys = [
        //     //     'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', '.', 'Home', 'End', ',', '-'
        //     // ];

        //     // Allow keys in allowedKeys, Ctrl + V, and the negative symbol `-`
        //     if (allowedKeys.includes(e.key) || (e.ctrlKey && e.key === 'v')) {
        //         // Prevent multiple `-` signs or a `-` sign after other characters
        //         if (e.key === '-' && $input.val().includes('-') && this.selectionStart !== 0) {
        //             e.preventDefault();
        //             return;
        //         }
        //         return; // Allow valid keys and Ctrl + V
        //     }

        //     // If shift key is pressed or non-numeric characters (other than period) are pressed, prevent it
        //     if (e.shiftKey || (e.key < '0' || e.key > '9')) {
        //         e.preventDefault(); // Block invalid characters
        //     }
        // });

        $input.on("keydown", function (e) {
            // Allow keys in allowedKeys, Ctrl + V, and the negative symbol `-`
            if (allowedKeys.includes(e.key) || (e.ctrlKey && e.key === 'v')) {
                // Allow `-` only at the start of the input (if cursor is at position 0)
                if (e.key === '-' && this.selectionStart !== 0) {
                    e.preventDefault(); // Prevent if `-` is not at the start
                    return;
                }
                
                // Prevent multiple `-` signs after the first one at the start
                if (e.key === '-' && $input.val().includes('-') && this.selectionStart !== 0) {
                    e.preventDefault(); // Prevent if there is already a `-` and it's not at the start
                    return;
                }
        
                return; // Allow valid keys and Ctrl + V
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