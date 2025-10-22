import { logError } from "./services/logger.js";
import { fetch } from "./services/request.js";
import { extractTemplate, handleAttributeValue, handleExpression, handleTrueAndFalseValues, uriExists } from "./utils.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Parse template string with data object
 * 
 * @param template String with property names (or column names)
 * @param data Object data properties
 * @returns Parsed template string
 */
const parse = (template: string, data: {}): string => {
    const regex: RegExp = /{{\s*([\w.]+)\s*}}/g;
    const result: string = template.replace(regex, (_, key) => {
        const value: string = key.split('.').reduce((obj: any, k: any) => (obj && obj[k] !== undefined) ? obj[k] : '', data);
        return String(value);
    });

    return result;
}

/**
 * Evaluate conditional statement in data-evaluate attribute
 * 
 * @param element HTML Element with data-evaluate attribute
 * @returns void
 */
const evaluateStatement = (element: Element | undefined): void => {
    if (!element) return;

    const statement: string = handleAttributeValue(element, "data-evaluate");
    const expression = handleExpression(statement);

    if (statement.includes("?")) {
        const [trueValue, falseValue] = handleTrueAndFalseValues(statement);

        try {
            if (eval(expression)) {
                if (trueValue !== undefined) element.textContent = trueValue;
            } else {
                if (falseValue !== undefined) element.textContent = falseValue;
            }
        } catch (error) {
            logError(new Error(`Error evaluating expression: ${expression} - ${error}`), "index");
            throw new Error(`Error evaluating expression: ${expression} - ${error}`);
        }
    } else {
        try {
            element.textContent = eval(expression);
        } catch (error) {
            logError(new Error(`Error evaluating expression: ${expression} - ${error}`), "index");
            throw new Error(`Error evaluating expression: ${expression} - ${error}`);
        }
    }
}

/**
 * Renders parsed string templates into HTML elements
 * 
 * @param elements Collection of HTML elements with class 'assemble'
 * @returns void
 */
export const render = (elements: Element | HTMLCollectionOf<Element> | undefined): void => {
    if (!elements) return;
    
    const headers = {"Authorization": `Bearer ${process.env.AUTHORIZATION}`, "Content-Type": `${process.env.CONTENT_TYPE}`};

    for (const element of Array.from(elements as HTMLCollectionOf<Element>)) {
        if (!uriExists(element)) continue;

        const elementCopy = element.cloneNode(true) as Element;
        const template = extractTemplate(elementCopy);
        const data = fetch(elementCopy.getAttribute("data-uri") as string, {"method": "GET", "headers": headers});

        elementCopy.innerHTML = parse(template as string, data);

        for (const child of Array.from(elementCopy.querySelectorAll("[data-evaluate]"))) {
            evaluateStatement(child);
        }

        element.replaceWith(elementCopy);     
    }
}