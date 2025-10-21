import { OPERATORS } from "./constants/arrays.js";
import { fetch } from "./services/request.js";
import { conditionExists, extractTemplate, followsConditionSyntax, uriExists } from "./utils.js";
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
    const regex = /{{\s*([\w.]+)\s*}}/g;
    const result = template.replace(regex, (_, key) => {
        const value = key.split('.').reduce((obj: any, k: any) => (obj && obj[k] !== undefined) ? obj[k] : '', data);
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
    if (!element || !conditionExists(element)) return;

    const statement = element.getAttribute("data-evaluate");

    if (!followsConditionSyntax(statement as string)) return;

    const parts = (statement as string).split(" ");
    const value1 = parts[0];
    const operator = parts[1];
    const value2 = parts[2];
    const ternaryOperator = parts[3];
    const trueFalseValues = parts[4]?.includes(":") ? parts[4].split(":") : parts[4];

    OPERATORS
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
    }
}