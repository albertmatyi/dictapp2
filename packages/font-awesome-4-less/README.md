#font-awesome-4-less
[Font Awesome](http://fortawesome.github.com/Font-Awesome/) 4 LESS source files as meteorite smart package.

##Installation
Import Font Awesome in on of your LESS files like this:
```css
@import "/packages/font-awesome-4-less/font-awesome.import.less";
```
Execute this command with the project directory:
```bash
ln -s ../packages/font-awesome-4-less/lib/fonts public/fontawesome
```

**Note:** the imported LESS files use the `fa-` prefix.

##Usage
Adding icons to your LESS by simply calling the #fa-icon mixin (example):
```css
.go-back-link i { #fa-icon(reply) }
.ok-back-link { #fa-icon(check-circle, green) }
```
Use the icon name without any prefixes. As shown in line 2, there is no need to add an `<i>` tag to show icons, also, you can optionally pass a color for the icon.
**Note:** aliases are not supported---You'll notice a "Less compiler error: variable @fa-var-... is undefined" error message. Please find the original name of the icon and use that instead.
