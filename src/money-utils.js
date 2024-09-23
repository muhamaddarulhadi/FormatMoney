/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 22/09/2024
    Version: 1.0
*/

// Utility to add and remove commas from numbers
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
}

// Export for UMD
export default MoneyUtils;