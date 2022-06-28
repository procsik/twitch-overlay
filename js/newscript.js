const twitch = window.Twitch.ext;
const app = document.querySelector('#app');
const switcher = app.querySelector('#switcher');

const env = {
  schema: 'wss',
  host: 'twitch-dbd-app.cyber-vologda.ru',

  game: 'Dead by Daylight',

  socket: null,
  context: null,
  ctxtype: null,
  token: null,

  ctimeout: null,

  switcher: false,
  clickInt: null,
};

const controller = {
  _data: {},
  set data(d) {
    this._data = d;
  },
  get data() {
    return this._data;
  },
};

const checkControllerData = () => {
  if (controller.data
    && Object.keys(controller.data).length === 0
    && Object.getPrototypeOf(controller.data) === Object.prototype) { return false; }
  return true;
};

const hideElem = () => {
  env.clickInt = setTimeout(() => { switcher.click(); }, 5000);
};

const btnHandler = (event) => {
  clearInterval(env.clickInt);
  const elemsAll = document.querySelectorAll('dbd-elem');

  if (!env.socket || env.socket.readyState === 0) {
    clearInterval(env.clickInt);
    switcher.style.display = 'none';
    env.switcher = false;
    elemsAll.forEach((value) => {
      value.style.display = 'none';
    });
  } else if (checkControllerData && elemsAll.length > 0) {
    if (!env.switcher) {
      hideElem();
      switcher.style.backgroundPosition = 'right';
      switcher.style.display = '';
      env.switcher = true;
      elemsAll.forEach((value) => {
        value.style.display = 'flex';
      });
    } else {
      switcher.style.backgroundPosition = 'left';
      switcher.style.display = '';
      env.switcher = false;
      elemsAll.forEach((value) => {
        value.style.display = 'none';
      });
    }
  }
};

switcher.addEventListener('click', btnHandler, false);
if (!env.socket || env.socket.readyState === 0) {
  switcher.style.display = 'none';
  switcher.removeEventListener('click', btnHandler, false);
  document.querySelectorAll('dbd-elem').forEach((value) => {
    value.style.display = 'none';
  });
  env.switcher = false;
}

const template = (p) => `
  <style>
    #svg-image {
      filter: brightness(0.8);
      opacity: 0.8;
    }

    .circle {
      opacity: 0.4;
    }

    #svg-image:hover {
      cursor: pointer;
      animation-duration: 1s;
      animation-fill-mode: forwards;
      animation-name: bright;
    }

    @keyframes bright {
      from {
        filter: brightness(0.8);
        opacity: 0.8;
      }
      to {
        filter: brightness(1);
        opacity: 1;
      }
    }

  </style>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:ev="http://www.w3.org/2001/xml-events" version="1.1" baseProfile="full" width="100%" height="100%">
  <defs>
    <mask id="mask1_elem_1">
      <image width="100%" height="100%" xlink:href="./img/${p.t}.png"></image>
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="black" stroke-width="5%"></line>
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="black" stroke-width="5%"></line>
      <!--line x1="0" y1="0" x2="100%" y2="100%" stroke="black" stroke-width="5%"></line>
      <line x1="0" y1="100%" x2="100%" y2="0" stroke="black" stroke-width="5%"></line-->
    </mask>
    <mask id="mask2_elem_1">
      <circle cx="50%" cy="50%" r="42%" stroke="white" stroke-width="32%" stroke-dasharray="${p.sda}px ${p.sdb}px"
        stroke-dashoffset="${p.sd}px" mask="url(#mask1_elem_1)"></circle>
    </mask>
    <mask id="mask3_elem_1">
      <circle cx="50%" cy="50%" r="42%" stroke="white" stroke-width="32%" stroke-dasharray="${p.sda1}px ${p.sdb1}px"
        stroke-dashoffset="${p.sd}px" mask="url(#mask1_elem_1)"></circle>
    </mask>
  </defs>
  <circle id="circle-1" class="circle" cx="50%" cy="50%" r="42%" fill="none" stroke="white" stroke-width="32%"
    mask="url(#mask1_elem_1)"></circle>
  <circle id="circle-2" class="circle" cx="50%" cy="50%" r="42%" fill="none" stroke="#e8c252" stroke-width="32%"
    mask="url(#mask3_elem_1)"></circle>
  <circle id="circle-3" class="circle" cx="50%" cy="50%" r="42%" fill="none" stroke="#ff0000" stroke-width="32%"
    mask="url(#mask2_elem_1)"></circle>
  <image id="svg-image" class="svg-image" width="100%" height="${p.hp}" y="${p.yp}" xlink:href="${p.icon}"></image>
</svg>
  `;

class dbdElement extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._name = newValue;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    clearInterval(this._update);
  }

  render() {
    this._max = 0;
    this._s = 0;
    this._v = 0;
    this._type = 'C';

    this.type = (controller.data[this._name].type === '2') ? 2 : 1;
    this._hp = '50%';
    this._yp = '14%';

    if (this.type === 2) {
      const h = parseInt(window.getComputedStyle(this).height, 10);
      this.style.height = `${h - h * 0.05}px`;
      this.style.width = `${h - h * 0.05}px`;
      this._hp = '70%';
      this._yp = '16%';
    }

    const icon = `./img/${this._name}.png`;
    fetch(icon).then((r) => {
      this.icon = (r.ok) ? icon : controller.data[this._name].icon;

      this.update();
      this._update = setInterval(() => { this.update(); }, 30000);
      return 0;
    }).catch(() => 0);
  }

  update() {
    const hp = this._hp;
    const yp = this._yp;
    const { icon } = this;

    if (Object.keys(controller.data).length !== 0) {
      this._max = (controller.data[this._name].max <= controller.data[this._name].average) ? controller.data[this._name].average : controller.data[this._name].max;
      this._s = Math.round((controller.data[this._name].current / this._max) * 100) / 100;
      this._v = Math.round((controller.data[this._name].average / this._max) * 100) / 100;
      this._type = (controller.data[this._name].type === '1') ? 'K' : 'C';

      this.setAttribute('data-before', controller.data[this._name].name);
    }

    const t = this._type;
    const h = parseInt(getComputedStyle(this).height, 10);
    const c1 = ((((h / 100) * 42) * Math.PI) * 2).toFixed(1);
    const sda = (c1 * ((this._s > 1) ? 1 : this._s)).toFixed(1);
    const sdb = c1 - sda;
    const sda1 = (c1 * ((this._v > 1) ? 1 : this._v)).toFixed(1);
    const sdb1 = c1 - sda1;
    const sd = ((Math.PI * h) * 0.21).toFixed(1);

    this.shadowRoot.innerHTML = template({
      sda, sdb, sda1, sdb1, sd, t, hp, yp, icon,
    });

    this.dom = this.mapDOM(this.shadowRoot);
    this.dom.image.addEventListener('mouseover', () => {
      clearInterval(env.clickInt);
      clearInterval(this._update);
      this.dom.circle.forEach((c) => {
        c.style.opacity = '1';
      });
    });

    this.stage = 0;
    this.dom.image.addEventListener('mouseout', () => {
      hideElem();
      this._update = setInterval(() => { this.update(); }, 30000);
      this.stage = 0;
      this.classList.toggle('dbd-elem-b', false);
      this.classList.toggle('dbd-elem-a', false);
      this.classList.toggle('dbd-elem-am', false);
      this.classList.toggle('dbd-elem-aa', false);
      this.classList.toggle('dbd-elem-ac', false);
      this.dom.circle.forEach((c) => {
        c.style.opacity = '0.4';
      });
    });

    this.dom.image.addEventListener('mousedown', (event) => {
      this.stage += 1;
      event.target.style.transform = 'scale(0.9) translate(5%,5%)';
      this.setAttribute('data-top', '50px');
      switch (this.stage) {
        case 1: {
          this.dom.circle.forEach((c) => {
            c.style.opacity = '0';
          });
          this.classList.toggle('dbd-elem-a', false);
          this.setAttribute('data-after', `max: ${Math.round(controller.data[this._name].max)}`);
          this.classList.toggle('dbd-elem-a');
          this.classList.toggle('dbd-elem-am');
          this.classList.toggle('dbd-elem-b', true);
          this.dom.circle1.style.opacity = '1';
          break;
        }
        case 2: {
          this.dom.circle.forEach((c) => {
            c.style.opacity = '0';
          });
          this.classList.toggle('dbd-elem-a', false);
          this.setAttribute('data-after', `avg: ${Math.round(controller.data[this._name].average)}`);
          this.classList.toggle('dbd-elem-a');
          this.classList.toggle('dbd-elem-am');
          this.classList.toggle('dbd-elem-aa');
          this.dom.circle1.style.opacity = '0.4';
          this.dom.circle2.style.opacity = '1';
          break;
        }
        case 3: {
          this.dom.circle.forEach((c) => {
            c.style.opacity = '0';
          });
          this.classList.toggle('dbd-elem-a', false);
          this.setAttribute('data-after', `cur: ${Math.round(controller.data[this._name].current)}`);
          this.classList.toggle('dbd-elem-a');
          this.classList.toggle('dbd-elem-aa');
          this.classList.toggle('dbd-elem-ac');
          this.dom.circle1.style.opacity = '0.4';
          this.dom.circle2.style.opacity = '0.4';
          this.dom.circle3.style.opacity = '1';
          break;
        }
        default: {
          this.dom.circle.forEach((c) => {
            c.style.opacity = '1';
          });
          this.classList.toggle('dbd-elem-a', false);
          this.classList.toggle('dbd-elem-ac');
          this.stage = 0;
          break;
        }
      }
    });

    this.dom.image.addEventListener('mouseup', (event) => {
      event.target.style.transform = 'scale(1)';
    });
  }

  mapDOM(scope) {
    return {
      image: scope.querySelector('.svg-image'),
      circle: scope.querySelectorAll('.circle'),
      circle1: scope.querySelector('#circle-1'),
      circle2: scope.querySelector('#circle-2'),
      circle3: scope.querySelector('#circle-3'),
    };
  }
}

twitch.onAuthorized((auth) => {
  env.token = auth.token;
});

const main = () => {
  if (!customElements.get('dbd-elem')) customElements.define('dbd-elem', dbdElement);
  env.socket.onmessage = (m) => {
    if (env.switcher) {
      switcher.style.backgroundPosition = 'right';
      switcher.style.display = '';
      document.querySelectorAll('dbd-elem').forEach((value) => {
        value.style.display = 'flex';
      });
    } else {
      switcher.style.backgroundPosition = 'left';
      switcher.style.display = '';
      document.querySelectorAll('dbd-elem').forEach((value) => {
        value.style.display = 'none';
      });
    }

    controller.data = JSON.parse(m.data);
    twitch.rig.log('Data: ', controller.data);
    if (document.querySelectorAll('dbd-elem').length === 0) {
      Object.keys(controller.data).forEach((value) => {
        const dbdElem = document.createElement('dbd-elem');
        dbdElem.setAttribute('name', value);
        dbdElem.style.display = (env.switcher) ? 'flex' : 'none';
        app.append(dbdElem);
      });
    }
  };
};

const start = () => {
  const initConnect = () => {
    if (env.context.game == env.game) return true;
    document.querySelectorAll('dbd-elem').forEach((e) => {
      e.remove();
    });
    clearInterval(env.ctimeout);
    env.socket = null;
    return false;
  };

  const connect = () => {
    env.socket = (env.socket) ? env.socket : new WebSocket(`${env.schema}://${env.host}/`);
    env.socket.onopen = () => {
      switcher.addEventListener('click', btnHandler, false);

      env.socket.send(JSON.stringify({
        token: env.token,
        context: env.context,
      }));
    };
    env.socket.onclose = () => {
      clearInterval(env.clickInt);
      switcher.style.display = 'none';
      switcher.removeEventListener('click', btnHandler, false);
      document.querySelectorAll('dbd-elem').forEach((value) => {
        value.style.display = 'none';
      });
      env.switcher = false;

      env.socket = null;
      env.ctimeout = setTimeout(() => {
        if (initConnect()) connect();
      }, 10000);
    };
    env.socket.onerror = () => {
      env.socket.close();
    };

    if (env.socket) main();
  };

  twitch.onContext((ctx, type) => {
    env.context = ctx;
    env.ctxtype = type;
    if (initConnect()) connect();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  start();
});
