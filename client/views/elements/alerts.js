Alerts.defaultOptions = {
    // Button with cross icon to hide (close) alert
    dismissable: true,

    // CSS classes to be appended on each alert DIV (use space for separator)
    classes: '',

    // Hide alert after delay in ms or false to infinity
    autoHide: 2000,

    // Time in ms before alert fully appears
    fadeIn: 200,

    // If autoHide enabled then fadeOut is time in ms before alert disappears
    fadeOut: 500,

    alertsLimit: 3
};

Router.onBeforeAction(function () { Alerts.removeSeen(); });
