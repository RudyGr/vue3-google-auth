"use strict";

import { inject } from "vue";

const storeKey = Symbol("gAuth");

window.gapi = null;

const configureGAuth = (gAuthInstance, config) => {
  // Default values
  const GoogleAuthDefaultConfig = {
    scope: "profile email",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    ],
  };
  gAuthInstance.prompt = "select_account";

  if (typeof config === "object") {
    gAuthInstance.GoogleAuthConfig = Object.assign(
      GoogleAuthDefaultConfig,
      config
    );
    if (config.scope) {
      gAuthInstance.GoogleAuthConfig.scope = config.scope;
    }
    if (config.prompt) {
      gAuthInstance.prompt = config.prompt;
    }
    if (!config.clientId) {
      console.warn("clientId is required");
    }
  } else {
    console.warn("invalid option type. Object type accepted only");
  }
};

const installClient = () => {
  const apiUrl = "https://apis.google.com/js/api.js";
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = apiUrl;
    script.onreadystatechange = script.onload = () => {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        setTimeout(() => {
          resolve();
        }, 500);
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  });
};

const initClient = (config) =>
  new Promise((resolve, reject) => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init(config)
        .then(() => {
          resolve(window.gapi);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

const load = (gAuthInstance, config, prompt) => {
  installClient()
    .then(() => initClient(config))
    .then((gapi) => {
      gAuthInstance.GoogleAuth = gapi.auth2.getAuthInstance();
      gAuthInstance.isInit = true;
      gAuthInstance.prompt = prompt;
      gAuthInstance.isAuthorized = gAuthInstance.GoogleAuth.isSignedIn.get();
    })
    .catch((error) => {
      console.error(error);
    });
};

const GAuth = function GAuth(options) {
  this.GoogleAuthConfig = null;
  this.prompt = "";

  // Config plugin
  configureGAuth(this, options);

  // Load and init client
  load(this, this.GoogleAuthConfig, this.prompt);

  this.signIn = (successCallback, errorCallback) =>
    new Promise((resolve, reject) => {
      if (!this.GoogleAuth) {
        if (typeof errorCallback === "function") {
          errorCallback(false);
        }
        reject(false);
        return;
      }
      this.GoogleAuth.signIn()
        .then((googleUser) => {
          if (typeof successCallback === "function") {
            successCallback(googleUser);
          }
          this.isAuthorized = this.GoogleAuth.isSignedIn.get();
          resolve(googleUser);
        })
        .catch((error) => {
          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
          reject(error);
        });
    });

  this.getAuthCode = (successCallback, errorCallback) =>
    new Promise((resolve, reject) => {
      if (!this.GoogleAuth) {
        if (typeof errorCallback === "function") {
          errorCallback(false);
        }
        reject(false);
        return;
      }
      this.GoogleAuth.grantOfflineAccess({ prompt: this.prompt })
        .then((resp) => {
          if (typeof successCallback === "function") {
            successCallback(resp.code);
          }
          resolve(resp.code);
        })
        .catch((error) => {
          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
          reject(error);
        });
    });

  this.signOut = (successCallback, errorCallback) =>
    new Promise((resolve, reject) => {
      if (!this.GoogleAuth) {
        if (typeof errorCallback === "function") {
          errorCallback(false);
        }
        reject(false);
        return;
      }
      this.GoogleAuth.signOut()
        .then(() => {
          if (typeof successCallback === "function") {
            successCallback();
          }
          this.isAuthorized = false;
          resolve(true);
        })
        .catch((error) => {
          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
          reject(error);
        });
    });
};

GAuth.prototype.install = function install(app) {
  app.provide(storeKey, this);
  app.config.globalProperties.$gAuth = this;
};

function useGAuth () {
  const gAuth = inject(storeKey);
  if (!gAuth) {
    console.error("GAuth plugin isn't install on Vue");
  }
  return gAuth;
};

function createGAuth(options = null) {
  return new GAuth(options);
}

export default { useGAuth, createGAuth };
