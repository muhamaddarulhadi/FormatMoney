/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 22/09/2024
    Version: 1.0
*/

import { MoneyUtils } from './money-utils.js';

export class MoneyFormatter {

    constructor(options = {}) {
        // Default options for decimal places
        this.options = {
            decimalPlaces: options.decimalPlaces || 2
        };
    }

    // Method to format a number to a specified decimal places
    formatNumber(num) {
        let unformattedValue = MoneyUtils.removeCommas(num);
        let formattedValue = parseFloat(unformattedValue).toFixed(this.options.decimalPlaces);
        return MoneyUtils.addCommas(formattedValue);
    }

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