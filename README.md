# match #

An JavaScript library to test JSON with some nice features.

## Install ##
I put it in my own npm scope because `match` is another existent lib and I have a big trouble naming things. Any suggestion is welcome.
```
npm install @ozkxr/match
```

## But, what it does? ##

Of course, match JSON objects.

You can compare primitives.

```javascript
// Numbers
match(3.1415, 3.1415) // true
//Strings
match('Uno Dos Tres', 'Uno Dos Tres') // true
// Booleans
match(false, false) // true
// And with undefined and null values
match(undefined, undefined) // true
match(null, null)  // true
```
And structures (objects and arrays).

```javascript
match({ name: 'Link', color: 'green' }, { name: 'Link', color: 'green' }) // true
match([ 'deku', 'goron', 'zora' ], [ 'deku', 'goron', 'zora' ]) //true
```

### But the nice part starts here ###

You can match using functions

```javascript
// Yeah, with functions!
match({ name: 'Samus' }, hero => hero.name.length >= 5) // true
```

And regular expressions

```javascript
// Yeah, with RegExp too!
match('Kvothe', /K*o*t*e/) // true
```

And everything together!

```javascript
match({
        name: { first: 'Walter', last: 'White' },
        age: 51
      },
      {
        name: { first: /[\w]*/, last: 'White' },
        age: age => age > 18
      }); // YEAH, true!
```

## Notes ##

* Is worth to mention that you only can use JSON-data as the first argument
of the function. Not functions or RegExp.
* I made this for test my API endpoints, thats why it only may be used to test JSON data.

## Contribution ##

Feel free to open an issue and/or make a PR if you found a bug or think in a way this lib or even the README can be improved.

## License ##

MIT
