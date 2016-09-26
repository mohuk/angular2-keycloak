import 'keycloak-js';
import { Injectable } from '@angular/core';

@Injectable()
export class KeycloakService {

static auth: {
    loggedIn: boolean,
    authz: KeycloakModule.IKeycloak,
    logoutUrl: string
};

  static init(): Promise<any> {
    let keycloakAuth = new Keycloak('keycloak.json');
    KeycloakService.auth.loggedIn = false;

      return new Promise((resolve, reject) => {
        keycloakAuth.init({ onLoad: 'login-required' })
          .success(() => {
            KeycloakService.auth.loggedIn = true;
            KeycloakService.auth.authz = keycloakAuth;
            KeycloakService.auth.logoutUrl = `${keycloakAuth.authServerUrl}/realms/demo/protocol/openid-connect/logout?redirect_uri=/angular2-product/index.html`;
            resolve();
          })
          .error(() => {
            reject();
          });
      });
    }

  logout() {
    console.log('*** LOGOUT');
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    window.location.href = KeycloakService.auth.logoutUrl;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz.updateToken(5)
          .success(() => {
            resolve(<string>KeycloakService.auth.authz.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      }
    });
  }
}
