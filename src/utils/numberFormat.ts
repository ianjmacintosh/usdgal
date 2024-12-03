const getNumberFormatChar = (char: "groupingSeparatorChar" | "decimalSeparatorChar", locale: string) => {
    const numberFormat = new Intl.NumberFormat(locale);
    const chars = {
        groupingSeparatorChar: numberFormat.format(1111).replace(/\d/g, ""),
        decimalSeparatorChar: numberFormat.format(1.1).replace(/\d/g, ""),
    }

    return chars[char]
};

export default getNumberFormatChar