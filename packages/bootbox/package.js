Package.describe({
    summary: "Programmatic dialog boxes using Twitter's bootstrap modals"
});

Package.on_use(function (api) {
    api.use(['jquery'], 'client'); // bootstrap-3 or 'bootstrap-3-less'
    api.add_files('lib/bootbox.js', "client");
});
