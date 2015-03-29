# realtime-resource v0.0.1 #

CRUD (create, read, update, delete) over Socket.io.

### Getting Started ###

Clone the repo and run

```
npm install
grunt
```

### Running tests ###

Server must be running in separate terminal
Open a new terminal and run tests:

```
npm test
```

## API ##

### Create ###

```
#!javascript
var resource = new Resource('test');
var test = resource.create({one:'1', two:'2'});
test.save(function(err) {
    console.log('resource saved');
});
```

### Read ###

```
#!javascript
var resource = new Resource('test');
resource.get({}, function(err, data) {
    console.log('here the data', data);
});
```

### Update ###

```
#!javascript
test.three = 3;
test.save();
```

### Delete ###

```
#!javascript
test.remove();
```

### Events ###

```
#!javascript
resource.on('save', function(err, data) {
    console.log('data saved', data);
});
resource.on('remove', function(err, id) {
    console.log('data removed', id);
});
```

## Licence ##

MIT