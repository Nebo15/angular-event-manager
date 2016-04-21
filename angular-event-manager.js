'use strict';

angular.module('eventManager', []).provider('EventManager', function () {

    return {
        config: {
            global_handlers_name: '$$_global'
        },
        $get: function ($log) {

            function EventManager (__config) {
                this.handlers = {};
                this.groupHandlers = {};

                var config = angular.extend({}, __config);
                var GLOBAL_HANDLERS_NAME = config.global_handlers_name;

                this.logEvent = function (name, options, group) {
                    this.trigger(name, options, group);
                };
                this.track = this.logEvent;

                function getEventName (name, group) {

                    // without group: eventName = name
                    // with group: eventName = group:name
                    // for empty event name ''
                    // for empty event nam with group eventName = group

                    return (group ? (group + (name ? ':' : '')) : '') + (name || '');
                }
                function isEventFromGroup (eventName, group) {
                    return eventName.indexOf(group + ':') === 0;
                }
                this.eventsFromGroup = function (group) {
                    return (Object.keys(this.handlers) || []).filter(function (name) {
                        return isEventFromGroup(name, group);
                    });
                };

                this.getEventName = getEventName;

                this.subscribe = function (name, fn, group) {
                    if (!Array.isArray(name)) {
                        name = [name];
                    }
                    group = group || '';

                    name.forEach(function (item) {
                        // event name = group:item
                        item = getEventName(item, group);
                        if (!Array.isArray(this.handlers[item])) {
                            this.handlers[item] = [];
                        }
                        this.handlers[item].push(fn);
                    }.bind(this));
                };
                this.unsubscribe = function (name, fn, group) {
                    name = getEventName(name, group);
                    this.handlers[name] = (this.handlers[name] || []).filter(function (item) {
                        if (item !== fn) {
                            return item;
                        }
                    });
                };
                this.trigger = function (name, options, group) {
                    name = getEventName(name, group);
                    var scope = window;
                    (this.handlers[name] || []).forEach(function(item) {
                        item.call(scope, name, options);
                    });
                    (this.handlers[GLOBAL_HANDLERS_NAME] || []).forEach(function (item) {
                        item.call(scope, name, options);
                    });

                    if (group) {
                        (this.groupHandlers[group] || []).forEach(function (item) {
                            item.call(scope, name, options);
                        });
                    }
                };

                this.subscribeGroup = function (fn, group) {
                    if (!group) {
                        $log.warn('Subscribe for undefined group name');
                        return;
                    }
                    if (!Array.isArray(this.groupHandlers[group])) {
                        this.groupHandlers[group] = [];
                    }
                    this.groupHandlers[group].push(fn);
                };

                this.unsubscribeGroup = function (fn, group) {
                    this.groupHandlers[group] = (this.groupHandlers[group] || []).filter(function (item) {
                        if (item !== fn) {
                            return item;
                        }
                    });
                };

                // react on all events
                this.subscribeAll = function (fn) {
                    this.subscribe(GLOBAL_HANDLERS_NAME, fn);
                };
                this.unsubscribeAll = function (fn) {
                    this.unsubscribe(GLOBAL_HANDLERS_NAME, fn);
                };

            }

            return new EventManager(this.config);
        }
    };
});