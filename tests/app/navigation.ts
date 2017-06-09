import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../src/meta/meta';
import { FRENCH } from '../../src/utils/i18n';

@WithRender
@Component
export class Navigation extends Vue {
    public routes: string[] = [];

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTagsByLanguage(FRENCH).forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
    }
}