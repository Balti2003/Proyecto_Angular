import { CanActivateChildFn, Router } from '@angular/router';
import { LocalKeys, LocalManagerService } from '../services';
import { inject, PLATFORM_ID } from '@angular/core';
import { appRoutes } from '../app.routes';
import { isPlatformServer } from '@angular/common';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const localManager = inject(LocalManagerService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) { return false };
  
  const token = localManager.getElement(LocalKeys.accesToken);

  if(token) {
    return true;
  }

  router.navigate([appRoutes.public.login], { replaceUrl: true });
  return false;

};
