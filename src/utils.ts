import { OPERATORS } from "./constants/arrays.js";
import { logError } from "./services/logger.js";

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

export const conditionExists = (e:Element): boolean | undefined => {
    if (!e || e.getAttribute("data-evaluate") === null) {
        logError(new Error(`Element is undefined or does not have data-evaluate attribute: ${e}`), "utils");
        return false;
    }

    return true;
}

export const followsConditionSyntax = (statement: string): boolean => {
    // <div data-evaluate="[value1] [OPERATOR] [value2] [?] [true value]:[false value] (or [determined value])>...</div>"

    if (!statement) {
        logError(new Error("Statement is empty"), "utils");
        return false;
    }

    const parts = statement.split(" ");

    if (parts.length < 5) {
        logError(new Error(`Statement is missing one or more parts: ${statement}`), "utils");
        return false;
    }
    const operator = parts[1];
    const ternaryOperator = parts[3];
    const determinedValue = parts[4];

    // Verify the determined value exists and has valid format
    if (!determinedValue || (determinedValue.includes(":") && determinedValue.split(":").length !== 2)) {
        logError(new Error(`Determined value is invalid. Must be either a single value or 'trueValue:falseValue': ${determinedValue}`), "utils");
        return false;
    }

    if (OPERATORS.every(op => operator !== op)) {
        logError(new Error(`Operator is not valid: ${operator}`), "utils");
        return false;
    }

    if (ternaryOperator !== "?") {
        logError(new Error(`3rd part must be a ternary operator: ${ternaryOperator}`), "utils");
        return false;
    }

    if (!determinedValue || !determinedValue.length || !determinedValue.includes(":")) {
        logError(new Error(`Determined value is not correctly formatted or it is empty: ${determinedValue}`), "utils");
        return false;
    }

    return true;
}