import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { AuthService, LocalKeys, LocalManagerService } from "../services";
import { catchError, switchMap, throwError } from "rxjs";
import { isPlatformServer } from "@angular/common";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const localManager = inject(LocalManagerService);
    const authService = inject(AuthService);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        return next(req);
    }

    const token = localManager.getElement(LocalKeys.accesToken);
    
    let headers = req.headers.set("Content-Type", "application/json");
    
    if (token) {
        headers = headers.set("Authorization", `Bearer ${token}`);
    }

    const authReq = req.clone({ headers });
    
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                return authService.refreshToken().pipe(
                    switchMap((newToken: string) => {
                        localManager.setElement(LocalKeys.accesToken, newToken);
                        
                        const updatedHeaders = req.headers.set("Authorization", `Bearer ${newToken}`);
                        const newReq = req.clone({ headers: updatedHeaders });
                        return next(newReq);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};