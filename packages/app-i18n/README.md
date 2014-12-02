# I18n package


## About

It provides templates and js with the `translate` method using which  one can internationalize the static part of the app (or simply make static strings customizable)

Moreover it offers templates (ui components) for editing static translations.

## Dependencies  `.dependencies`

app-component

app-property

panels


## Database

It uses the table created by app-property to store static strings


## API

### `App.i18n.translate(key, defaultValue, locale)`

The method returns the translation for a given key

#### Parameters

* `key` - the key for the translation
* `defaultValue` - the value that will be displayed if no string is specified (optional)
* `locale` - if you don't want to use the locale provided by the context you can override it via this parameter (optional)

#### Returns

The translation string


## Templates

### `{{> i18nPanel }}`

A panel that contains controls using which we set the translations for our app


## Template helpers

### `{{ translate key defaultValue locale}}`

Basically it is the same method as the one described in the **API** section, but usable from the templates


## ACL actions `acl_actions.js`

* `i18n.manage`
