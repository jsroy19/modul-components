import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button-group.html?style=./button-group.scss';
import { BUTTON_GROUP_NAME } from '../component-names';

const ICON_POSITION_LEFT: string = 'left';

export interface MButtonGroupData {
    value: string;
    label: string;
    active: boolean;
    iconName: string;
}

@WithRender
@Component
export class MButtonGroup extends Vue {
    @Prop({
        default: () => {
            return [
                {
                    'value': 'button-1',
                    'label': 'Button 1',
                    'iconName': 'default'
                },
                {
                    'value': 'button-2',
                    'label': 'Button 2',
                    'active': true,
                    'iconName': 'chip-check'
                },
                {
                    'value': 'button-3',
                    'label': 'Button 3',
                    'iconName': 'chip-error'
                }
            ];
        }
    })
    public buttonGroupValues: MButtonGroupData[];
    @Prop({ default: 'button-group' })
    public name: string;
    @Prop({ default: false })
    public hasIcon: string;
    @Prop({ default: ICON_POSITION_LEFT })
    public iconPosition: string;
    @Prop({ default: true })
    public isFullSize: boolean;

    public componentName: string = BUTTON_GROUP_NAME;
    private isFocus: boolean = false;
    private activeValue: string = '';
    private value: string = '';
    private defaultActiveValue: string = this.findActive();

    private mounted(): void {
        if (this.defaultActiveValue != '') {
            this.activeValue = this.defaultActiveValue;
        }
    }

    private findActive(): any {
        for (let i = 0; i < this.buttonGroupValues.length; i++) {
            if (this.buttonGroupValues[i].active == true) {
                return this.buttonGroupValues[i].value;
            }
        }
    }

    private onClick(event): void {
        this.isFocus = false;
        this.$emit('click', this.activeValue);
    }

    private get hasIconLeft(): boolean {
        return this.iconPosition == ICON_POSITION_LEFT ? true : false;
    }
}

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;