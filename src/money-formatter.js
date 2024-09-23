/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 22/09/2024
    Version: 1.0
*/

import { MoneyUtils } from './money-utils.js';

export class MoneyFormatter {
    // constructor(options) {
    //     // Merge default options with provided ones
    //     this.options = Object.assign({
    //         decimalPlaces: 2 // Default number of decimal places
    //     }, options);
    // }

    constructor(options = {}) {
        // Default options for decimal places
        this.options = {
            decimalPlaces: options.decimalPlaces || 2
        };
    }

    // // Method to add commas to a number string
    // addCommas(num) {
    //     num = num.toString();
        
    //     // Split into integer and decimal parts
    //     if (num.includes('.')) {
    //         let parts = num.split(".");
    //         parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //         return parts.join(".");
    //     } else {
    //         return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     }
    // }

    // // Method to remove commas from a number string
    // removeCommas(num) {
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

    // Method to format a number to a specified decimal places
    formatNumber(num) {
        let unformattedValue = MoneyUtils.removeCommas(num);
        let formattedValue = parseFloat(unformattedValue).toFixed(this.options.decimalPlaces);
        return MoneyUtils.addCommas(formattedValue);
    }

    // regexNumber(num) {
    //     const regex = new RegExp(`^-?\\d*(\\.\\d{0,${this.options.decimalPlaces}})?$`);

    //     if (!regex.test(unformattedValue)) {
    //         return 
    //     }
    // }

    // Method to parse and format a number, maintaining decimal places
    parseAndFormatForView(num) {
        // Check if num is an empty string
        if (num === '' || num === null || num === undefined || isNaN(parseFloat(num))) {
            return '-'; // Return as '-'
        }

        let formattedValue = this.formatNumber(num);
        return formattedValue;
    }

    parseAndFormatForInput(num) {
        // Check if num is an empty string
        if (num === '' || num === null || num === undefined || isNaN(parseFloat(num))) {
            return 0.00; // Return as '0.00'
        }

        let formattedValue = this.formatNumber(num);
        return formattedValue;
    }
}

// Expose it to global scope
window.MoneyFormatter = MoneyFormatter;

// Export for UMD
export default MoneyFormatter;