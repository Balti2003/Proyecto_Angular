import { Routes } from '@angular/router';
import { appRoutes } from '../app.routes';
import { PrivateComponent } from './private.component';
import { authGuard } from '../guards';

export const routes: Routes = [
    {
        path: '',
        component: PrivateComponent,
        canActivateChild: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: appRoutes.private.characters
            },
            {
                path: appRoutes.private.characters,
                loadComponent: () => 
                    import('./characters/characters.component').then(
                        m => m.CharactersComponent)
            }
        ]
    },

];