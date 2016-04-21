# Angular Event Manager

Event Manager for Angular JS apps.

It's simple implementation of event manager. You can use it for simplify tracking events in your app in single object and then send event to the several external services. 

## How to install

Install as Bower package

```
bower install angular-event-manager --save
```

Add module to angular module ap

```

angular.module('app', [
    ...,
    'eventManager'
]);
```

### Example

```

// tracking event

angular.module('app').controller('AppController', function ($scope, EventManager) {

    EventManager.track('AppControlerOpen', {data: 'example'});
    
});

// subscribe to event

angular.module('app').run(function (EventManager, $mixpanel) {

    EventManager.subscribe(['AppControlerOpen'], function (eventName, data) {
        
        // you can track here event for external services
        // eg, $mixpanel.track(eventName);
        
    }); 
    
    EventManager.subscribeAll(function (name, data) {
        // receive all events
    });
    
    EventManager.unsubscribe(['Event1', 'Event2'], function () {});
    EventManager.unsubscribeAll(function () {});
    
});
```
