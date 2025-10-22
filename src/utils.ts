import { logError } from "./services/logger.js";

/**
 * Extract template string from HTML element
 * @param e 
 * @returns 
 */
export const extractTemplate = (e: Element): string | undefined => {
    if (!e) {
        logError(new Error("Element is undefined"), "utils");
        throw new Error("Element is undefined");
    }

    if (e.querySelectorAll(".template").length > 1) {
        logError(new Error(`Multiple template elements found. Only one template element is needed: ${e}`), "utils");
        throw new Error("Multiple template elements found. Only one template element is needed");
    }

    return e.innerHTML;
}

/**
 * Check if element has data-uri attribute
 * @param e 
 * @returns 
 */
export const uriExists = (e:Element): boolean | undefined => {
    if (!e || !e.className.includes("assemble")) {
        logError(new Error(`Element is undefined or does not have class 'assemble': ${e}`), "utils");
        throw new Error("Element is undefined or does not have class 'assemble'");
    }

    if (!e.hasAttribute("data-uri")) {
        logError(new Error(`Element does not have a data-uri attribute: ${e}`), "utils");
        return false;
    }

    return true;
}

/**
 * Handles attribute value retrieval
 * 
 * @param element 
 * @param attribute 
 * @returns 
 */
export const handleAttributeValue = (element: Element, attribute: string): string => {
    if (!element.hasAttribute(attribute)) {
        logError(new Error(`Element does not have attribute: ${attribute}`), "utils");
        throw new Error(`Element does not have attribute: ${attribute}`);
    }

    if (typeof element.getAttribute(attribute) !== "string") {
        logError(new Error(`Attribute ${attribute} is not a string`), "utils");
        throw new Error(`Attribute ${attribute} is not a string`);
    }

    if (!element.getAttribute(attribute)) {
        logError(new Error(`Attribute ${attribute} has no value`), "utils");
        throw new Error(`Attribute ${attribute} has no value`);
    }

    return element.getAttribute(attribute) as string;
}

/**
 * Handles expression extraction
 * 
 * @param value 
 * @returns 
 */
export const handleExpression = (value: string): string => {
    if (!value) {
        logError(new Error("Value is empty"), "utils");
        throw new Error("Value is empty");
    }

    const expression = value.includes("?") ? value.split("?")[0] : value;

    if (!expression || expression.trim() === "") {
        logError(new Error("Expression is empty"), "utils");
        throw new Error("Expression is empty");
    }

    return expression.trim();
}

/**
 * Handles true and false value extraction
 * 
 * @param value 
 * @returns 
 */
export const handleTrueAndFalseValues = (value: string): [string, string] => {
    if (!value.includes("?")) {
        logError(new Error("Value does not contain true/false values"), "utils");
        throw new Error("Value does not contain true/false values");
    }

    const parts = value.split("?");

    if (!parts[1] || parts[1].trim() === "") {
        logError(new Error("True/false values part is empty"), "utils");
        throw new Error("True/false values part is empty");
    }

    if (parts.length !== 2 || !parts[1].includes(":")) {
        logError(new Error("True/false values are not properly formatted"), "utils");
        throw new Error("True/false values are not properly formatted");
    }

    const [trueValue, falseValue] = parts[1].split(":").map(v => v.trim());

    if (!trueValue || !falseValue) {
        logError(new Error("True or false value is missing"), "utils");
        throw new Error("True or false value is missing");
    }

    return [trueValue, falseValue];
}