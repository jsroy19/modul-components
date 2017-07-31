import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './panel.html?style=./panel.scss';
import { PANEL_NAME } from '../component-names';

export enum MPanelMode {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

@WithRender
@Component
export class MPanel extends Vue {
    @Prop({ default: MPanelMode.PRIMARY })
    public mode: MPanelMode;
    @Prop({ default: true })
    public shadow: boolean;
    @Prop({ default: true })
    public border: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public componentName: string = PANEL_NAME;

    private get propMode(): MPanelMode {
        return this.mode == MPanelMode.SECONDARY ? MPanelMode.SECONDARY : MPanelMode.PRIMARY;
    }

    private get hasHeader(): boolean {
        if (this.$slots.header || this.$slots['header-right-content']) {
            return true;
        }
        return false;
    }

    private get hasHeaderRightContentSlot(): boolean {
        return !!this.$slots['header-right-content'];
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasPaddingHeader(): boolean {
        return this.paddingHeader && this.padding;
    }

    private get hasPaddingBody(): boolean {
        return this.paddingBody && this.padding;
    }

    private get hasPaddingFooter(): boolean {
        return this.paddingFooter && this.padding;
    }
}

const PanelPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
