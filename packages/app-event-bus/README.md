# EventBus


## About

It provides the application a generic eventing system.


## Dependencies  `.dependencies`

app-component

### mrt

emitter


## API

### `App.eventBus`

Is an instance of `EventEmitter` (`new EventEmitter();`) providing the following Node / jQuery like api:

* `on` / `addListener`
* `once` / `once`
* `emit` / `trigger`
* `off` / `removeListener`
* `removeAllListeners`
