# arach-node
A modern, promise based nodejs wrapper around the Project Arachnid CSAM API

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