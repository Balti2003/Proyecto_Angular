import { Routes } from '@angular/router';
import { appRoutes } from '../app.routes';
import { PrivateComponent } from './private.component';

export const routes: Routes = [
    {
        path: '',
        component: PrivateComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: appRoutes.private.characters
            },
            {
                path: appRoutes.private.characters,
                loadComponent: () => import('./characters/characters.component').then(m => m.CharactersComponent)
            }
        ]
    },

];