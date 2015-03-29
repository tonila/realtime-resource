# realtime-resource v0.0.1 #

CRUD (create, read, update, delete) using Socket.io and Mongodb.

### Getting Started ###

Clone the repo and start server by runing the following:

```
npm install
grunt
```

### Run tests ###

**Prerequisities:** 

* Mongodb is installed and running in localhost.

* Server is running in separate terminal

**Open a new terminal and run:**

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
var query = {} // get all
resource.get(query, function(err, data) {
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