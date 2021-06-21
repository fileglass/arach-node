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
