import Template from './template.js';

export default class myString extends HTMLElement {
  // constructor() {
  //   super();
  //   this.attachShadow({ mode: 'open' });

  //   const s = 0.75;
  //   const v = 0.25;

  //   const h = parseInt(getComputedStyle(this).height, 10);
  //   const r = 42;
  //   const c1 = ((((h / 100) * r) * Math.PI) * 2).toFixed(1);
  //   const sda = (c1 * s).toFixed(1);
  //   const sdb = c1 - sda;
  //   const sda1 = (c1 * v).toFixed(1);
  //   const sdb1 = c1 - sda1;
  //   const sd = ((Math.PI * h) * 0.21).toFixed(1);

  //   this.shadowRoot.innerHTML = Template.render(this, {
  //     sda, sdb, sda1, sdb1, sd,
  //   });
  //   this.root = Template.map(this.shadowRoot);
  // }

  connectedCallback() {
    const s = 0.75;
    const v = 0.25;

    const h = parseInt(getComputedStyle(this).height, 10);
    const r = 42;
    const c1 = ((((h / 100) * r) * Math.PI) * 2).toFixed(1);
    const sda = (c1 * s).toFixed(1);
    const sdb = c1 - sda;
    const sda1 = (c1 * v).toFixed(1);
    const sdb1 = c1 - sda1;
    const sd = ((Math.PI * h) * 0.21).toFixed(1);

    const template = document.querySelector('template');
    const clone = template.content.cloneNode(true);
    // clone += Template.render(this, {
    //   sda, sdb, sda1, sdb1, sd,
    // });

    this.appendChild(clone);
  }

  init() {
    // this.innerHTML = Template.render(this, {
    //   sda, sdb, sda1, sdb1, sd,
    // });
  }
}

if (!customElements.get('my-string')) {
  customElements.define('my-string', myString);
}
