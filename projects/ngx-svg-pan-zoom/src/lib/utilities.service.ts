import { Injectable } from '@angular/core';
import { isElement, isNumber, isObject } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  extend(target: { [x: string]: any; }, source: { [x: string]: any; }) {
    target = target || {};
    for (var prop in source) {
      // Go recursively
      if (isObject(source[prop])) {
        target[prop] = this.extend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }
    return target;
  }
  // isElement(o: HTMLElement | SVGElement | SVGSVGElement | Element ) {
  //   return (
  //     o instanceof HTMLElement ||
  //     o instanceof SVGElement ||
  //     o instanceof SVGSVGElement || //DOM2
  //     (o &&
  //       typeof o === "object" &&
  //       o !== null &&
  //       o.nodeType === 1 &&
  //       typeof o.nodeName === "string")
  //   );
  // }
  // isObject(o: any) {
  //   return Object.prototype.toString.call(o) === "[object Object]";
  // }
  // isNumber(n: string | number) {
  //   return !isNaN(parseFloat(n)) && isFinite(n);
  // }
  getSvg(elementOrSelector: string | Element) {
    let element: HTMLObjectElement, svg;

    if (!isElement(elementOrSelector)) {
      // If selector provided
      if (typeof elementOrSelector === "string") {
        // Try to find the element
        try {
          element = document.querySelector(elementOrSelector) as HTMLObjectElement;
        } catch {
          throw new Error(
            "Provided selector did not find any elements. Selector: " +
            elementOrSelector
          );
        }
      } else {
        throw new Error("Provided selector is not an HTML object nor String");
      }
    } else {
      element = elementOrSelector as HTMLObjectElement;
    }

    if (element.tagName.toLowerCase() === "svg") {
      svg = element;
    } else {
      if (element.tagName.toLowerCase() === "object") {
        svg = element.contentDocument?.documentElement;
      } else {
        if (element.tagName.toLowerCase() === "embed") {
          svg = element.getSVGDocument()?.documentElement;
        } else {
          if (element.tagName.toLowerCase() === "img") {
            throw new Error(
              'Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.'
            );
          } else {
            throw new Error("Cannot get SVG.");
          }
        }
      }
    }
    return svg;
  }
  proxy(fn: { apply: (arg0: any, arg1: IArguments) => any; }, context: any) {
    return () => {
      return fn.apply(context, arguments);
    };
  }
  getType(o: any) {
    return Object.prototype.toString
      .apply(o)
      .replace(/^\[object\s/, "")
      .replace(/\]$/, "");
  }
  mouseAndTouchNormalize(evt: { clientX: number | null | undefined; clientY: number; touches: string | any[] | undefined; originalEvent: { clientX: undefined; clientY: any; } | undefined; }, svg: { getBoundingClientRect: () => any; }) {
    // If no clientX then fallback
    if (evt.clientX === void 0 || evt.clientX === null) {
      // Fallback
      evt.clientX = 0;
      evt.clientY = 0;

      // If it is a touch event
      if (evt.touches !== void 0 && evt.touches.length) {
        if (evt.touches[0].clientX !== void 0) {
          evt.clientX = evt.touches[0].clientX;
          evt.clientY = evt.touches[0].clientY;
        } else if (evt.touches[0].pageX !== void 0) {
          var rect = svg.getBoundingClientRect();

          evt.clientX = evt.touches[0].pageX - rect.left;
          evt.clientY = evt.touches[0].pageY - rect.top;
        }
        // If it is a custom event
      } else if (evt.originalEvent !== void 0) {
        if (evt.originalEvent.clientX !== void 0) {
          evt.clientX = evt.originalEvent.clientX;
          evt.clientY = evt.originalEvent.clientY;
        }
      }
    }
  }
  isDblClick(evt: { detail: number; timeStamp: number; clientX: number; clientY: number; }, prevEvt: { timeStamp: number; clientX: number; clientY: number; } | null | undefined) {
    // Double click detected by browser
    if (evt.detail === 2) {
      return true;
    }

    // Try to compare events
    else if (prevEvt !== void 0 && prevEvt !== null) {
      var timeStampDiff = evt.timeStamp - prevEvt.timeStamp, // should be lower than 250 ms
        touchesDistance = Math.sqrt(
          Math.pow(evt.clientX - prevEvt.clientX, 2) +
          Math.pow(evt.clientY - prevEvt.clientY, 2)
        );

      return timeStampDiff < 250 && touchesDistance < 10;
    }

    // Nothing found
    return false;
  }
  get now() {
    return Date.now || new Date().getTime();// IE9
  }
  throttle(func: Function, wait: number, options: any) {
    const that = this;
    let context: null | undefined, args: IArguments | null, result: unknown;
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;
    if (!options) {
      options = {};
    }
    let later = () => {
      previous = options.leading === false ? 0 : that.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };
    return function()  {
      const now = that.now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      let remaining = wait - (now - previous);
      context = this; // eslint-disable-line consistent-this
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout as NodeJS.Timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
  createRequestAnimationFrame(refreshRate: number | string) {
    var timeout = null;

    // Convert refreshRate to timeout
    if (refreshRate !== "auto" && refreshRate < 60 && refreshRate > 1) {
      timeout = Math.floor(1000 / (refreshRate as number));
    }

    if (timeout === null) {
      return window.requestAnimationFrame || this.requestTimeout(33);
    } else {
      return this.requestTimeout(timeout);
    }
  }

  /**
   * Create a callback that will execute after a given timeout
   *
   * @param  {} timeout
   * @return {}
   */
  requestTimeout(timeout: number) {
    return (callback: () => {}) => {
      window.setTimeout(callback, timeout);
    };
  }

}
