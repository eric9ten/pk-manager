import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('../pages/home/home.component').then(
                (c) => c.HomeComponent
            ),
            title: 'Home',
    },
    {
        path: ':user/dashboard',
        loadComponent: () =>
            import('../pages/dashboard/dashboard.component').then(
                (c) => c.DashboardComponent,
            ),
            title: 'Dashboard',
    },
    {
        path: ':user/teams',
        loadComponent: () =>
            import('../pages/teams-view/teams-view.component').then(
                (c) => c.TeamsViewComponent
            ),
            title: 'Teams',
    },
    {
        path: ':user/events',
        loadComponent: () =>
            import('../pages/events-view/events-view.component').then(
                (c) => c.EventsViewComponent
            ),
            title: 'Events',
    },
    {  path: '', redirectTo: 'home', pathMatch: 'full' }
];
