import domReady from 'domready';
import '../scss/index.scss';

class App {
  constructor() {
    console.log('Test');
  }
}

window.App = App;
window.domReady = domReady;