export interface ElementOptions {
  className?: string;
  id?: string;
  text?: string;
  attributes?: Record<string, string>;
  children?: (HTMLElement | string)[];
  onClick?: (event: MouseEvent) => void;
}

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {}
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.id) {
    element.id = options.id;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    for (const [key, val] of Object.entries(options.attributes)) {
      element.setAttribute(key, val);
    }
  }

  if (options.onClick) {
    element.addEventListener('click', options.onClick as EventListener);
  }

  if (options.children) {
    for (const child of options.children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }
  }

  return element;
};

export const clearElement = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};
