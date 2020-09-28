# What is it ? 

An utilities to help you to connect in your application with google oauth2 service

It's an adaption for **Vue3** of [vue-google-oauth2](https://github.com/guruahn/vue-google-oauth2) plugin from [guruahn](https://github.com/guruahn)

## Installation 

**Installation with npm** \
`npm i vue3-google-auth` 

**Installation with Yarn** \
`yarn add vu3-google-auth`

## Initialization

On your main file

```vue
import { createGAuth } from './plugin/vue3-google-auth';

const GAuth = createGAuth({
  clientId: YOUR_CLIENT_ID
  scope: YOUR_SCOPE',
  prompt: YOUR_PROMPT',
});

app.use(GAuth)
```