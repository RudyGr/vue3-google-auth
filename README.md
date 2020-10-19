# What is it ?

An utilities to help you to connect in your application with google oauth2 service

It's an adaption for **Vue3** of [vue-google-oauth2](https://github.com/guruahn/vue-google-oauth2) plugin from [guruahn](https://github.com/guruahn)

## Installation

**Installation with npm** \
`npm add vue3-google-auth`

## Initialization

On your main file

```javascript
import gAuth from 'vue3-google-auth';

const $gAuth = gAuth.createGAuth({
  clientId: YOUR_CLIENT_ID
  scope: YOUR_SCOPE,
  prompt: YOUR_PROMPT,
});

app.use($gAuth)
```

## Methods
| Property     | Description        | Type     | Params |
|--------------|--------------------|----------|--------|
| signIn       | function for sign-in | Function  | successCallback, errorCallback |
| getAuthCode  | function for getting authCode | Function  | successCallback, errorCallback |
| signOut      | function for sign-out | Function  | successCallback, errorCallback |

## Usages

### Access $gAuth instance

#### Composition API 
You can load gAuth instance in setup function by using `useGAuth()`

```javascript
import gAuth from 'vue3-google-auth'
const $gAuth = gAuth.useGAuth()
```

#### Without composition API
You can access instance directly by using `this.$gAuth`