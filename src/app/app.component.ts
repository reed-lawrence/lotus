import { COMPILER_OPTIONS, Component } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';




// export class ValueChangeEvent<T> extends Event {
//   constructor(
//     public value: T,
//     public parent?: Event
//   ) {
//     super('_value_change_');
//     this.value = value;
//   }
// }

// export interface HTMLElementExt extends HTMLElement {
//   componentRef: ThinComponent;
// }

// export function IsHTMLElementExt(obj: unknown): obj is HTMLElementExt {
//   return obj instanceof HTMLElement && obj.getAttribute('data-reflects') === 'component';
// }

// export interface AfterInit {
//   afterInit(): void;
// }

// export function HasAfterInitHook(obj: any): obj is AfterInit {
//   return !!obj && typeof (obj as any).afterInit === 'function';
// }

// export class ComponentFactory {

//   static hydrate<T extends ThinComponent>({ ele, component, parent }: { ele?: Node, component?: T, parent?: T }) {

//     if (component) {
//       if (!ele)
//         ele = document.createElement(component.selector);

//       component.el = ele as any;
//       component.el.setAttribute('data-reflects', 'component');
//       component.el.innerHTML = component.html;

//     }

//     if (ele && ele.nodeType === 3) {
//       const original = ele.textContent || '';
//       const templateBindings = (ele.textContent || '').match(/({{[ ]*([A-z]|[0-9]|[$]|[_])+[ ]*}})/g) || [];

//       for (const str of templateBindings) {

//         const name = str.match(/([A-z]|[0-9]|[$]|[_])+/g)![0];
//         const target = (component || parent)!;

//         if (!target[name as keyof T])
//           throw new Error('binding not found');

//         const binding = target[name as keyof T] as any as Binding<unknown>;



//         binding.onValueChange((value: any) => {
//           const replaceIndex = original.indexOf(str);
//           const replaceLength = str.length;
//           const str1 = original.substring(0, replaceIndex);
//           const str2 = original.substring(replaceIndex + replaceLength);
//           console.log(original, str, replaceIndex, replaceLength, str1, str2);
//           ele!.textContent = str1 + String(value) + str2;
//         });
//       }
//     }

//     ele!.childNodes.forEach(n => {
//       const ctor = component_registry.get(n.nodeName.toLowerCase());

//       if (ctor) {
//         ComponentFactory.hydrate({ ele: n, component: ctor() });
//       }

//       else {
//         ComponentFactory.hydrate({ ele: n, parent: parent || component });
//       }
//     });

//     if (HasAfterInitHook(component))
//       component.afterInit();


//   }
// }

// export abstract class ThinComponent<T extends HTMLElement = HTMLElement> {

//   el!: T;

//   constructor(
//     public selector: string,
//     public html: string = '',
//   ) { }

// }

// export class Binding<T> {

//   value: T;
//   private _onValueChange?: (value: T) => any;

//   setValue(value: T, { emit = true, parent = undefined as any as Event } = {}) {
//     const event = new ValueChangeEvent(value);

//     if (this._onValueChange && emit)
//       this._onValueChange(value);
//   }

//   onValueChange(fn: (value: T) => any) {
//     this._onValueChange = fn;
//   }

//   constructor(value: T) {
//     this.value = value;
//   }
// }

// export class ThinInput<T> extends ThinComponent<HTMLInputElement> implements AfterInit {

//   input!: HTMLInputElement;

//   bind(binding: Binding<T>) {
//     console.log('bind');

//     this.input.value = binding.value as any;

//     this.input.addEventListener('input', (parent) => {
//       binding.setValue(this.input.value as any, { parent });
//     });

//     this.input.addEventListener('_value_change_' as any, (ev: ValueChangeEvent<T>) => {
//       binding.value = ev.value;

//       if (!ev.parent || ev.parent.target !== this.input)
//         this.input.value = ev.value as any;

//     });
//   }

//   constructor() {
//     super('dynamic-input', '<input></input>');
//   }

//   afterInit(): void {
//     this.input = this.el.querySelector('input')!;
//   }


// }

// export class AppRootComponent extends ThinComponent {
//   constructor() {
//     super('dynamic-root',
//       `<my-form><my-form>`
//     );
//   }
// }

// export class MyFormComponent extends ThinComponent implements AfterInit {

//   myValue = new Binding('test');

//   str = new Binding('');

//   constructor() {
//     super('my-form',
//       `<label for='fname'>First Name</label><div><dynamic-input id='fname' data-bindto='myValue'></dynamic-input></div><span>Hello {{ str }}, how are you?</span>`
//     );
//   }

//   afterInit(): void {
//     console.log('afterInit');

//     this.myValue.onValueChange((value) => {
//       console.log(value);
//       this.str.setValue(value.toLowerCase());
//     });

//     this.str.setValue('Reed');
//     setTimeout(() => this.str.setValue('Ashley'), 2000);
//   }
// }

namespace DOM {

  export const component_registry = new Map<string, () => Component<any>>();

  export type Operator<In, Out> = (arg: In) => Out;

  export class DataStream<EventType> {

    private subscribers = [] as DataStream<any>[];
    private operators = [] as Operator<any, any>[];
    private lastValue?: EventType;

    subscribe<Out>(...operations: Operator<EventType, Out>[]) {
      const output = new DataStream(operations);
      this.subscribers.push(output);
      output.next(this.lastValue);
      return output;
    }

    next(value: any) {
      for (const op of this.operators)
        value = op(value);

      this.publish(value);
    }

    private publish(value: EventType) {
      for (const sub of this.subscribers)
        sub.next(value);
      this.lastValue = value;
    }

    constructor(ops: Operator<any, any>[] = []) {
      this.operators = ops;
    }

  }

  export class Variable<T = unknown> extends DataStream<T> {
    private _value!: T;

    get value(): T {
      return this._value;
    }

    setValue(value: T) {
      this._value = value;
      this.next(this._value);
    }

    constructor(value: T) {
      super();
      this.setValue(value);
    }
  }

  interface HasValue extends HTMLElement {
    value: string | number | boolean;
  }

  function HasValue(ele: HTMLElement): ele is HasValue {
    return ele instanceof HTMLInputElement;
  }

  export class ComponentFactory {
    static hydrate<T extends Component>(component: T) {

      if (component.content) {
        const content = Array.isArray(component.content) ? component.content : [component.content];
        console.log(content);
        for (const entry of content) {
          if (entry instanceof Component) {

            ComponentFactory.hydrate(entry);

            if (entry.renderIf) {
              const placeholder = document.createComment('placeholder');
              component.el.append(placeholder);

              entry.renderIf.subscribe((value) => {
                if (!!value)
                  placeholder.replaceWith(entry.el);
                else
                  entry.el.replaceWith(placeholder);
              });

            }
            else
              component.el.append(entry.el);

            if (entry.style) {
              for (const key in entry.style) {
                const value = entry.style[key];

                const kebab = key.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

                if (value instanceof DataStream) {
                  value.subscribe((value) => {
                    entry.el.style.setProperty(kebab, String(value));
                  });
                }
                else
                  entry.el.style.setProperty(kebab, String(value));

              }
            }

          }
          else if (entry instanceof DataStream) {
            entry.subscribe((value: any) => {
              component.el.innerHTML = '';

              value = Array.isArray(value) ? value : [value];

              for (const o of value) {
                if (o instanceof Component) {
                  this.hydrate(o);
                  component.el.append(o.el);
                }
                else {
                  component.el.innerHTML += o;
                }
              }
            });
          }
          else if (typeof entry === 'string') {
            component.el.innerHTML = entry;
          }
        }
      }

      if (component.on) {
        for (const obj of component.on)
          component.el.addEventListener(obj.event, obj.perform);
      }

    }

    static create(selector: 'div', opts: Omit<ComponentOpts, 'selector' | 'value'>): Component<HTMLDivElement>;
    static create(selector: 'input', opts: Omit<ComponentOpts, 'selector'>): Component<HTMLInputElement>;
    static create<T extends HTMLElement = HTMLElement>(selector: string, opts: Omit<ComponentOpts, 'selector'>): Component<T> {
      return new Component({
        selector,
        ...opts
      });
    }
  }

  export class ValueChangedEvent<T> extends Event {
    constructor(
      public value: T,
      public emit: 'none' | 'exclude-target' | 'exclude-aux' | 'all' = 'all'
    ) {
      super('binding_value_changed');
    }
  }

  // export class Binding<T> {

  //   private listeners: ((ev: ValueChangedEvent<T>, binding: this) => any)[] = [];

  //   setValue(value: T, emit: 'none' | 'exclude-target' | 'exclude-aux' | 'all' = 'all') {
  //     this.value = value;
  //     const ev = new ValueChangedEvent(value, emit);
  //     for (const listener of this.listeners)
  //       listener(ev, this);
  //   }

  //   onValueChanges(fn: (ev: ValueChangedEvent<T>, binding: this) => any) {
  //     this.listeners.push(fn);
  //     fn(new ValueChangedEvent(this.value), this);
  //   }

  //   pipe<U>(fn: (value: T) => U) {
  //     const output = new Binding<U>(undefined as any);
  //     this.onValueChanges((ev) => output.setValue(fn(ev.value)))
  //     return output;
  //   }

  //   constructor(
  //     public value: T
  //   ) {

  //   }
  // }

  type ContentType = string | Component | DataStream<any>;
  type CSSMap = {
    [Key in keyof CSSStyleDeclaration]: string | DataStream<any>;
  }
  type CSSMapExt = Omit<CSSMap, 'setProperty'> & { [index: string]: string | DataStream<any> }

  export interface ComponentOpts {
    selector: string;
    content?: ContentType | ContentType[];
    value?: string | number | DataStream<any>;
    renderIf?: DataStream<boolean>;
    style?: Partial<CSSMapExt>;
    on?: { event: string; perform: (ev: any) => any }[];
  }

  export class Component<T extends HTMLElement = HTMLElement> {

    el: T;
    content?: ComponentOpts['content'];
    value?: ComponentOpts['value'];
    renderIf?: ComponentOpts['renderIf'];
    style?: ComponentOpts['style'];
    on?: ComponentOpts['on'];

    constructor(opts: ComponentOpts) {
      this.el = document.createElement(opts.selector) as T;
      this.content = opts.content;
      this.value = opts.value;
      this.renderIf = opts.renderIf;
      this.style = opts.style;
      this.on = opts.on;
    }
  }

  export class Bind {
    static TwoWay(component: Component, variable: Variable, event = 'input', key = 'value') {

      component.el.addEventListener(event, () => variable.setValue(component.el[key as keyof HTMLElement]));
      variable.subscribe((value) => (component.el as any)[key] = value);

    }
  }
}

class AppRootComponent extends DOM.Component {

  constructor() {
    super({
      selector: 'dynamic-root',
      content: new MyFormComponent()
    });
  }
}

class MyFormComponent extends DOM.Component {
  constructor() {

    const myValue = new DOM.Variable('test');
    const input = DOM.ComponentFactory.create('input', {
      value: myValue,
      on: [
        { event: 'click', perform: (ev) => console.log(ev) },
        { event: 'click', perform: (ev) => console.log('clicked') }
      ]
    });

    DOM.Bind.TwoWay(input, myValue);

    myValue.subscribe((val) => console.log(val));

    setTimeout(() => myValue.setValue('123123'), 2000);

    super({
      selector: 'my-form',
      content: [
        input
      ]
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {



    const root = new AppRootComponent();
    DOM.ComponentFactory.hydrate(root);
    document.body.append(root.el);


  }

}
