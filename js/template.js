export default {
  render(props) {
    return `${this.html(props)}
           ${this.css()}`;
  },
  html(p) {
    return `
      <span slot="mask2">1
      </span>
      <span slot="mask3">2
      </span>
    `;
  },
  css() {
    return `
    <style>
      :host {

      }
    </style>
    `;
  },
  map(scope) {
    return {
      host: scope.querySelector('svg').root,
    };
  },
};
