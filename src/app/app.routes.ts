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
    {
        path: 'games',
        loadComponent: () =>
            import('../pages/events-view/events-view.component').then(
                (c) => c.EventsViewComponent
            ),
    },
    // { path: 'teams', component: TeamsViewComponent },
    {  path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
