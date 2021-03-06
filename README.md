# arach-node
A modern, promise based Node.js wrapper around the [Project Arachnid CSAM API](https://projectarachnid.ca/en/#shield).


## Options:
```ts
	apikey: string (required)
	url: string (required)
	trueOnError: boolean (default: true)
	exitOnErr: boolean (default: false)
```
Typescript example:
```ts
import Filter from "arach-node"
const arach = new Filter(options)
const file = someBuffer()
const resp = await arach.isImageSafe(file, "test.png", "image/png")
//resp =
/*
     safe: boolean
     rawResponse: Object[]
     errored: boolean
*/
```
Generics: The `isImageSafe` method has 2 generics (type arguments), both to manage the type safety. <br>
Usage: <br>
`await arach.isImageSafe<true, true>(file, "test.png", "image/png")` <br>
The example above turns off the strict typings of both string arguments, so any string format can be passed (normally `${string}.${string}` and `${string}/${string}` is allowed)

## Error handling:
```ts
arach.onError((err: string, rawErr: any) => {
    //do something
})
```

## Using streams:
Native streams are supported since V2, the `convertStreamToBuffer` function is deprecated.
```ts
const resp = await arach.isImageSafe(stream, "test.png", "image/png")
```
