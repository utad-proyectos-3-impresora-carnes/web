import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class name inputs into a single string, 
 * while resolving conflicting Tailwind CSS classes.
 *
 * @param {...ClassValue[]} classValues - A list of class name inputs. These can be:
 *   - strings (e.g., "p-2")
 *   - arrays of class names (e.g., ["bg-red-500", "text-white"])
 *   - objects where keys are class names and values are booleans (e.g., { "hover:bg-blue-500": isHovered })
 *
 * @returns {string} - A single merged class string with Tailwind conflicts resolved.
 *
 * @example
 * combineClassNames("p-2", { "bg-red-500": true, "text-white": false }, "p-4")
 * // => "bg-red-500 p-4"
 */
export function combineClassNames(...inputs) {
	return twMerge(clsx(inputs));
}
