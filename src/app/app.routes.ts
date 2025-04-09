import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
            import('../pages/dashboard/dashboard.component').then(
                (c) => c.DashboardComponent
            ),
    },
    {
        path: 'teams',
        loadComponent: () =>
            import('../pages/teams-view/teams-view.component').then(
                (c) => c.TeamsViewComponent
            ),
    },
    {  path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
