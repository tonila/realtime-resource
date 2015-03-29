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

### save ###

Create and update record.
 
```
#!javascript
var resource = new Resource('test');
var test = resource.create({one:'1', two:'2'});
test.save(function(err) {
    console.log('resource saved');
});
```


## Licence ##

MIT