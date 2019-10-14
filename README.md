# match-json [![Build Status](https://travis-ci.org/ozkxr/match-json.svg?branch=master)](https://travis-ci.org/ozkxr/match)

A JavaScript library to test JSON APIs.

It is built to test REST API endpoints but, of course, it can used to whatever you want.

## Install

```bash
npm install match-json
```

## Functionality

Match JSON Primitives.

```javascript
// Numbers
match(3.1415, 3.1415); // => true

//Strings
match("Uno Dos Tres", "Uno Dos Tres"); // => true

// Booleans
match(false, false); // => true

// And with undefined and null values
match(undefined, undefined); // => true
match(null, null); // => true
```

Match Structures (objects and arrays).

```javascript
match({ name: "Link", color: "green" }, { name: "Link", color: "green" }); // => true
match(["deku", "goron", "zora"], ["deku", "goron", "zora"]); // => true
```

### But the nice part starts here

Matching using Functions

```javascript
// Yeah, with functions!
match({ name: "Samus" }, hero => hero.name.length >= 5); // => true
```

Matching using regular expressions

```javascript
// Yeah, with RegExp too!
match("Kvothe", /K.ot.*e?/); // => true
```

Also, `match-json` can check JSON types using constructor functions

```javascript
// Yeah, with RegExp too!
match(5, Number); // => true

match("Hola, mundo", String); // => true

match(false, Boolean); // => true
```

And everything together!

```javascript
match(
  {
    name: { first: "Walter", last: "White" },
    age: 51,
    breakingBad: true
  },
  {
    name: { first: /[\w]*/, last: "White" },
    age: age => age > 18,
    breakingBad: Boolean
  }
); // => true
```

### Partials

There is also support for partials.

```
import match, { partial } from 'match-json';

// No partial mode
match({ id : 5, name: 'john' }, { id: Number }) // => false

// Partial mode
partial({ id : 5, name: 'john' }, { id: Number }) // => true
```

NOTE: Only objects (and not arrays) are affected by partial mode.

### Bake

`match-json` also provides a `bake` function that can be used to predefine an expected pattern.

```javascript
const nameIsLarge = match.bake({ name: name => name.length > 10 });
nameIsLarge("Tom"); // => false
nameIsLarge("Tooooooooom"); // => true
```

### Signatures

#### Match signature

- `match( a : T, b : T, partialMode : boolean? ) : boolean`
- `match( a : T, test : RegExp, partialMode : boolean? ) : boolean`
- `match( a : T, test : PredicateFunction, partialMode : boolean? ) : boolean`
- `match( a : T, test : JSONTypeConstructorFunction, partialMode : boolean? ) : boolean`

#### Bake signature

- `bake( a: T, partialMode : boolean? ) : PredicateFunction`

- ( where PredicateFunction = ( w : T ) : boolean )
- ( where JSONTypeConstructorFunction = Number, String OR Boolean )

## Notes

- Is worth to mention that you only can use JSON-data as the first argument
  of the function. Not functions or RegExp.
- I made this for test my API endpoints, thats why it only acepts to test JSON data.

## Contribution

Feel free to open an issue and/or make a PR if you found a bug or think in a way this lib or even the README can be improved.

## License

MIT
