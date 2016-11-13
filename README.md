# amplitude

![Build Status](https://travis-ci.org/crookedneighbor/amplitude.svg?branch=master) ![npm version](https://badge.fury.io/js/amplitude.svg)

Server side implimentation of [Amplitude](https://amplitude.com)'s http api.

## Install

```bash
npm install amplitude --save
```

## Basic Initialization

```javascript
var Amplitude = require('amplitude')
// The only required field is the api token
var amplitude = new Amplitude('api-token')
```

## Track an event

Pass in any keys listed on the [Amplitude http api](https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API). The only required keys are `event_type` and either `user_id` or `device_id`. If you initialized the Amplitude object with a user/device id, they can be ignored when calling the track method.

```javascript
var data = {
  event_type: 'some value', // required
  user_id: 'some id', // only required if device id is not passed in
  device_id: 'some id', // only required if user id is not passed in
  event_properties: {
    //...
  },
  user_properties: {
    //...
  }
}
amplitude.track(data)
```

## Identify API

The `identify` method allows you to [make changes to a user without sending an analytics event](https://amplitude.zendesk.com/hc/en-us/articles/205406617). 

```javascript
var data = {
  event_type: 'some value', // required
  user_id: 'some id', // only required if device id is not passed in
  device_id: 'some id', // only required if user id is not passed in
  event_properties: {
    //...
  },
  user_properties: {
    //...
  }
}
amplitude.identify(data)
```

### CamelCase Data

If you prefer camelCase variables, you can pass in the camelCase version instead to the `track` and `identify` methods:

```javascript
var data = {
  eventType: 'some value', // required
  userId: 'some id', // only required if device id is not passed in
  deviceId: 'some id', // only required if user id is not passed in
  eventProperties: {
    //...
  },
  userProperties: {
    //...
  }
}
amplitude.track(data)
```

This is the full list of properties that will be automatically transformed:

```
userId -> user_id
deviceId -> device_id
eventType -> event_type
eventProperties -> event_properties
userProperties -> user_properties
appVersion -> app_version
osName -> os_name
deviceBrand -> device_brand
deviceManufacturer -> device_manufacturer
deviceModel -> device_model
deviceType -> device_type
locationLat -> location_lat
locationLng -> location_lng
```

### User/Device ID

If the user/device id will always be the same, you can initialize the object with it. Passing a user id or device id in the `track` and `identify` methods will override the default value set at initialization.

```javascript
var amplitude = new Amplitude('api-token', { user_id: 'some-user-id' })
// or
var amplitude = new Amplitude('api-token', { device_id: 'some-device-id' })

amplitude.track({
  event_type: 'some value'
})

amplitude.track({
  event_type: 'some value',
  user_id: 'will-override-the-default-id'
})
```

### Promises

The `track` and `identify` methods returns a promise.

```javascript
amplitude.track(data)
  .then(function(result) {
    //... do something
  }).catch(function(error) {
    //... do something
  })
```

## Export your data

The export method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [export api](https://amplitude.zendesk.com/hc/en-us/articles/205406637-Export-API-Export-your-app-s-event-data) and requires a start and end string in the format `YYYYMMDDTHH`.

The method returns a stream.

```javascript
var fs = require('fs')
var stream = fs.createWriteStream('./may-2016-export.zip')

var amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.export({
  start: '20160501T20',
  end: '20160601T20'
}).pipe(stream)
```

## User Search

The user search method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [dashboard api](https://amplitude.zendesk.com/hc/en-us/articles/205469748-Dashboard-Rest-API-Export-Amplitude-Dashboard-Data#user%20search).

Search for a user with a specified Amplitude ID, Device ID, User ID, or User ID prefix.

```javascript
var amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userSearch('some-id-or-user-prop')
```

This method returns a Promise that resolves to a 'matches' object. An example 'matches' object looks like:

```javascript
{
    "matches": [
        {
            "user_id": "myusername",
            "amplitude_id": 12345
        }
    ],
    "type": "match_user_or_device_id"
}
```

Or if no matches were found:
```javascript
{
    "matches": [],
    "type": "nomatch"
}
```

Search for a user with a specified Amplitude ID, Device ID, User ID, or User ID prefix.

```javascript
var amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userSearch('some-id-or-user-prop', {withUserActivity: true})
```

The method returns the `userActivity()` Promise of the first match (see below for an example).


## User Activity

The user activity method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [dashboard api](https://amplitude.zendesk.com/hc/en-us/articles/205469748-Dashboard-Rest-API-Export-Amplitude-Dashboard-Data#user-activity).

Get a user summary and their recent events. This method requires an amplitude_id. You can use the user search method to find that.

```javascript
var amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userActivity('amplitude_id')
```

This method returns a Promise that resolves to a 'userData' object. An example 'userData' object looks like:

```javascript
{
    "userData": {
        "user_id": "myusername",
        "canonical_amplitude_id": 12345,
        "merged_amplitude_ids": [11111, 22222],
        "num_events": 142,
        "num_sessions": 23,
        "usage_time": 2570259,
        "first_used": "2015-03-14",
        "last_used": "2015-04-22",
        "purchases": 2,
        "revenue": 9.98,
        "platform": "iOS",
        "os": "ios 8.2",
        "version": "3.4.9",
        "device": "Apple iPhone",
        "device_type": "Apple iPhone 6",
        "carrier": "AT&T",
        "country": "United States",
        "region": "California",
        "city": "San Francisco",
        "dma": "San Francisco-Oakland-San Jose, CA",
        "language": "English",
        "start_version": "1.2.3",
        "device_ids": ["somedevice", "someotherdevice"],
        "last_location": {
            "lat": 37.133,
            "lng": -122.241
        },
        "properties": {
            "age": 32
            "gender": "female"
        }
    },
    "events": [...]
}
```

If there is nothing found for the passed 'amplitude_id', the Promise will resolve to an empty 'userData' object:

```javascript
{
    "userData": {
        "num_sessions": 0,
        "purchases": 0,
        "revenue": 0,
        "merged_amplitude_ids": [],
        "num_events": 0,
        "canonical_amplitude_id": 1,
        "user_id": null,
        "last_location": null,
        "usage_time": 0,
        "last_device_id": null,
        "device_ids": []
    },
    "events": []
}
```

## Changelog

View the [releases page](https://github.com/crookedneighbor/amplitude/releases) for changes in each version.

<!---
Do not change anything below this comment. It is generated automatically.
------>

## Contributors

+ [Erki Esken](http://deekit.net/)
