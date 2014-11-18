# Item module


## About

It provides DB storage access and utility functions for generic items.

An item has by default a `type` and a `parent` item reference (`id`).
This way they can form a hierarchical / tree structure. Other than that thay may contain any type of information.


## Dependencies  `.dependencies`

app-component

app-acl

app-property


## Database

Creates and exposes `App.item.collection` backed by the `items` table


## API

### App.packageName.method(parameter)

Generic description of the method

#### Parameters

* `parameter` - the parameter description

#### Returns


    {
    	propA: '', // desciprtion
    	ne: '' // of the return values
    }

## `Meteor.methods`

### `item.save`

## Events

Register events using `App.eventBus.on[e](eventName, callback)`

### `eventName` - callback(evParams...)`

Event is triggerred when

#### Parameters

* `evParams` - Description of the parameter


## Templates

### `{{> appPackageName tParam }}`

Generic description

#### Parameters

* `tParam` - Description of the parameter


## Template helpers

### `{{ appPackageName "hlpParam"}}`

Generic description

#### Parameters

* `hlpParam` - Description of the parameter


## Properties  `properties.js`

### packageName.property

What it defines
Should be defined as a JSON array: eg: `["admin", "editor", "visitor"]`


## ACL actions `acl_actions.js`

* `packageName.actionName` - description
