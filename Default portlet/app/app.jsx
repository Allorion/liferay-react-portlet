import React from 'react';

class App {
    constructor() {
        this.formTemplate = `
        <div>
            <h1 class="caption">allorion.ru</h1>
        </div>
        `
    }

    init() {
        document.getElementById('input').innerHTML = this.formTemplate;
    }
}

const app = new App();
app.init();