# amplitude

Server side implimentation of [Amplitude](https://amplitude.com)'s http api.

## Install

```bash
npm install amplitude --save
```

## Initialization

```javascript
var Amplitude = require('amplitude');
// Initialize with user id
var amplitude = new Amplitude('api-token', { user_id: 'some-user-id' });
// Or initialize with device id
var amplitude = new Amplitude('api-token', { device_id: 'some-device-id' });
```

## Track an event

Pass in any keys listed on the [Amplitude http api](https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API). The only required key is `event_type`.

```javascript
var data = {
  event_type: "some value", // required
  event_properties: { 
    //... 
  },
  user_properties: { 
    //... 
  }
}
amplitude.track(data);
```

## Track an event with an optional callback

```javascript
amplitude.track(data, function(error, response){
  // If post was succesful, error will be null
  // Currently, the response returned from the amplitude api is an empty object
  //... do something
});
```
