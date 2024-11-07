/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 07/11/2024
    Version: 1.3
*/

// Utility
export class MoneyUtils {
    static addCommas(num) {
        num = num.toString();
        
        // Split into integer and decimal parts
        if (num.includes('.')) {
            let parts = num.split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        } else {
            return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    static removeCommas(num) {
        // Convert num to a string and check if it contains commas
        if (typeof num === 'string' && num.includes(',')) {
            return num.replace(/,/g, '');
        }
    
        // If num is not a string, convert it to a string and handle it
        if (typeof num !== 'string') {
            num = num.toString();
        }
    
        return num.replace(/,/g, ''); // If no commas, this will simply return the string as is
    }

    static sanitizedValue(num) {
        // Remove all characters except digits, decimal point, and negative sign
        let sanitizedValue = num.replace(/[^0-9\.\-]/g, '');
    
        // Ensure only one `-` at the start and only one decimal point
        if (sanitizedValue.indexOf('-') > 0) {
            sanitizedValue = sanitizedValue.replace('-', ''); // Remove `-` if it's not at the start
        }
    
        let decimalIndex = sanitizedValue.indexOf('.');
    
        // If there's a decimal point, remove any additional decimals
        if (decimalIndex !== -1) {
            num = sanitizedValue.slice(0, decimalIndex + 1) + sanitizedValue.slice(decimalIndex + 1).replace(/\./g, ''); // Keep only one decimal point
        }
    
        return num;
    }

    static checkValueContainsOnly(num) {
        // If input is blank or only contains a decimal point, do not format
        if (num === "" || num === "." || num === "-") {
            return; // Exit the function if input is blank, only ".", or "-"
        }
    }
}

// Export for UMD
export default MoneyUtils;