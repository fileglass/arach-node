# arach-node
A modern, promise based Node.js wrapper around the [Project Arachnid CSAM API](https://projectarachnid.ca/en/#shield).

Typescript example:
```ts
import Filter from "arach-node"
const arach = new Filter("apikey", "url", true)
const file = someBuffer()
const resp = await arach.isImageSafe(file, "test.png", "image/png")
//resp = 
/*
     safe: boolean
     rawResponse: Object[]
     errored: boolean
*/
```
Generics: The `isImageSafe` has 2 generics (type arguments), both to manage the type safety. <br>
Usage: <br>
`await arach.isImageSafe<true, true>(file, "test.png", "image/png")` <br>
The example above turns off the strict typings of both string arguments, so any string format can be passed (normally `${string}.${string}` and `${string}/${string}` is allowed)

## Error handling:
```ts
arach.onError((err: string) => {
    //do something
})
```

## Using streams:

```ts
const buffer = await arach.convertStreamToBuffer(myStream)
const resp = await arach.isImageSafe(buffer, "test.png", "image/png")
```
