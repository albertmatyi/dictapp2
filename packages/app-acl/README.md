# Access Control Lists package


## About

The package adds easy access control management to the application.

It also provides a UI with a:

* **user / role** matrix - for assigning roles to the users
* **role / action** - matrix - for assigning permissions to roles


## Dependencies

app-component
app-property
panels

## Database

Creates the acl table containing role/action assignments


## API


### App.acl.registerAction(actionName)

Registers an actionname, that will appear in the UI for editing

#### Parameters

* `actionName` - The name of the action (preferably in the form: `app.file.upload`)

### App.acl.isAllowed(actionName)

Will check - by default - the acl table if the current user is allowed to perform the action and returns the result

* `true` if yes
* any other value if not

The method takes care of correct context and argument passing.

#### Parameters

* `actionName` - The name of the action to be allowed.

### App.acl.ifAllowed(actionName, method, wrap)

Will check - by default - the acl table if the current user is allowed to perform the action, and execute the given method accordingly. Otherwise it will throw an exception.

The method takes care of correct context and argument passing.

#### Parameters

* `actionName` - The name of the action to be allowed.
* `method` - The method to be executed in case of success
* `wrap` - if true, the method is not executed right away, but returned for it to be exposed (Ex.: via `Meteor.methods`)

### App.acl.allow(actionMatcher, method)

The method lets you override the acl table checking and provide your own programmatic authorisation logic.

Actionmatcher should be a `regex` to override access control in a module (Ex. `app\.file\..*` ) or in the whole application (Ex. `app\..*` or simply `.*`)

#### Parameters

* `actionMatcher` - The regex for the action(s) to override access control for
* `method` - The method, whose signature should be `method(actionName)` that should return `true` if it allows the user. Any other value returned results in blocking the execution of the original function.

## Properties

### acl.roles

Should be defined as a JSON array: eg: `["admin", "editor", "visitor"]`
