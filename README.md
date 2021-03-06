
<h1 align="center">[Itee Doc]</h1>
<br>

<p align="center">The itee doc is a JsDoc3 template, it allow to generate your documentation using React components and bootstrap v4.</p>
<br>

<p align="center">
    <a href="https://www.npmjs.com/package/itee-doc">
        <img src="https://img.shields.io/npm/v/itee-doc" alt="Current package version">
    </a>
    <a href="https://travis-ci.org/Itee/itee-doc">
        <img src="https://travis-ci.org/Itee/itee-doc.svg?branch=master" alt="Build status">
    </a>
    <a href="https://github.com/semantic-release/semantic-release">
        <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Build status">
    </a>
</p>

<br>
<h2>How to install</h2>

From npm:

    npm install itee-doc

If you want to build the repository from source follow these instructions:

    git clone https://github.com/Itee/itee-doc.git
    npm install
    npm run build
    
then you can copy/paste the module you need from builds folder.
    
<br>
<h2>How to use</h2>

<p align="center">At begin was <a href="https://itee.github.io/itee-doc/">RTFM</a> !</p>
<br>
In case you have clone the repository you could also auto-generate the documentation using: 

    npm run doc

then you will be able to use like this.
In your projects `package.json` file add a generate script:

```json
"script": {
  "doc": "node_modules/.bin/jsdoc --configure jsdoc.conf.json"
}
```

In your `jsdoc.conf.json` file, add a template option.

```json
{
    "plugins": [],
    "recurseDepth": 10,
    "source": {
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },

    "opts": {
      "template": "node_modules/itee-doc"
    },

    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```

<h2>How to configure</h2>

// Incoming soon...

<br>
<h2>License (BSD-3-Clause)</h2>

**Copyright (c) 2015-Present, Itee, Valcke Tristan [https://github.com/Itee](https://github.com/Itee). All rights reserved.**

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- Neither the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

You should have received a copy of the [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause) along 
with this program.  If not, see [https://opensource.org/licenses/BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause).
