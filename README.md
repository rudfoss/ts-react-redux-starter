# ts-react-redux-starter
A complete project starter kit for a TypeScript React/Redux application with full support for code splitting and no hidden configs

## Get started
```
git clone https://github.com/rudfoss/ts-react-redux-starter.git [your project name]
cd [your project name]
git remote set-url [your project repository url]
npm i
npm run dev
```
Running these commmands clones the starter to a new folder on your maching, replaces the endpoint so that you can start committing code, installs all dependencies and finally starts the dev server

## Features
- No global dependencies (everything in one package)
- TypeScript with full type checks
- VSCode configurations for
	- Auto linting
	- Using local version of TypeScript
	- Code snippets
- TSLint with recommended rules
- React
- Redux
	- Redux Sagas
	- Duck pattern with code splitting on ducks
- SASS support for awesome stylesheets
- CSS Modules and global css (via `*.global.css`)
- Source maps in dev and production (for debugging)
- Routing
	- Code splitting pattern
	- Error handling
- Webpack bundling
	- Production bundle `yarn build`
	- Development server bundle `yarn dev`
	- Analysis bundle `yarn build:analyze`
	- Chunking
	- Minification
	- Development server disk output for SPA with server side code
- Browser compatibility through .browserslistrc and automatic polyfills with `babel`
- Testing with Jest

## Guided tour
This section explains every aspect of the starter kit in detail.

### Folder structure
**`.vscode`**

This folder contains settings specific to VSCode. For now it only specifies that we should use the local version of TypeScript and that we should autofix linting issues on save.

**`src`**

This is where you will build your application. It contains a set of additional folders for structuring your application. See the [Application Structure](#application-structure) section of the guided tour for details.

**`webpack`**

This folder contains webpack configurations for development, production and analysis. It also contains a small `tsconfig.json` file used by `ts-node` and `webpack` to parse the configuration files as they are also written in TypeScript

**`dist`**

This folder will be created once you build your application and will contain the entire bundled and packaged source.

**`dist-dev`**

This folder contains the output when you run the development server. If you are processing the `index.html` file through some server side code and updating its content (such as with server side rendering or passing initial redux state) you can read the file from here and get full use of hot-reloading from your server. See [Advanced Scenarios](#advanced-scenarios) for a more detailed explanation.

### Application Structure

#### Code splitting
This project attempts to, as far as possible, hide the intricacies of code splitting from features. A feature may simply return its API and the `StoreManager` and helper code will inject it as needed. This greatly simplifies building features as they do not need to know whether they are async or not.

#### DemoLogin feature
The DemoLogin feature is an example meant for you to remove once you clone the project. It shows a simple implementation of:
- Dynamically loaded components
- Dynamically loaded ducks (with sagas)
- Sub-routing within a feature

#### Ducks
Duck files are collections of action, action creators, reducers and selectors. They are meant to encompass a complete feature in the application in one (or more) files. This project follows the duck pattern described here: [https://github.com/erikras/ducks-modular-redux](https://github.com/erikras/ducks-modular-redux) with a few additions:

- Ducks MUST export a "duck" object matching the IDuckExport interface.
- 

## Advanced Scenarios

## Notes

### SASS dependency version locked
The `sass` (dart-sass) dependency has been version locked due to a pre-release version being deployed without proper tagging. The pre-release version does not work correctly yet is automatically installed if you simply install the latest `sass`.