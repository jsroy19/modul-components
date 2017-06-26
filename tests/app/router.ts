import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Meta from '../../src/meta/meta';
import { Attributes } from './attributes/attributes';
import { Navigation } from './navigation/navigation';
import { MediaQueriesTest } from './media-queries/media-queries';
import { Viewer } from './viewer';

Vue.use(Router);

const componentRoutes: RouteConfig[] = [{
    path: '/',
    component: Navigation
}, {
    path: '/attributes',
    component: Attributes
}, {
    path: '/media-queries',
    component: MediaQueriesTest
}];

Meta.getTags().forEach(tag => {
    componentRoutes.push({
        path: '/' + tag,
        meta: tag,
        component: Viewer
    });
});

export default new Router({
    mode: 'history',
    routes: componentRoutes
});
