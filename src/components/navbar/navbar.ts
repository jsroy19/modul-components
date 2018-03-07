import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './navbar.html?style=./navbar.scss';
import { NAVBAR_NAME, NAVBAR_ITEM_NAME } from '../component-names';
import NavbarItemPlugin, { BaseNavbar, Navbar } from '../navbar-item/navbar-item';
import { ElementQueries, ElementQueriesMixin } from '../../mixins/element-queries/element-queries';
import { ComputedOptions } from 'vue/types/options';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

export enum MNavbarSkin {
    Light = 'light',
    Dark = 'dark',
    LightTab = 'light-tab',
    DarkTab = 'dark-tab',
    Plain = 'plain',
    Arrow = 'arrow'
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MNavbar extends BaseNavbar implements Navbar {

    @Model('change')
    @Prop()
    public selected: string;
    @Prop({
        default: MNavbarSkin.LightTab,
        validator: value =>
            value == MNavbarSkin.Light ||
            value == MNavbarSkin.Dark ||
            value == MNavbarSkin.LightTab ||
            value == MNavbarSkin.DarkTab ||
            value == MNavbarSkin.Plain ||
            value == MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop()
    public line: boolean;
    @Prop({ default: true })
    public margin: boolean;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public arrowMobile: boolean;

    public selectedElem: HTMLElement;

    private isAnimActive: boolean = false;
    private internalValue: any | undefined = '';
    private hasScrolllH: boolean = false;
    private computedHeight: number = 0;

    // public selecteItem(el): void {
    //     if (el != undefined) {
    //         if (this.skin == MNavbarSkin.Light) {
    //             this.setLinePosition(el);
    //         }
    //         if (this.skin == MNavbarSkin.Arrow) {
    //             this.setArrowPosition(el);
    //         }
    //         this.scrollToSelectedElem();
    //     }
    // }

    ///////////////////
    public updateValue(value: any): void {
        this.model = value;
        console.log('updateValue: ', value, this.model);
    }

    protected created(): void {
        this.internalValue = undefined;
    }

    @Watch('selected')
    protected onValueChange(value: any): void {
        this.internalValue = value;
    }

    public get model(): any {
        // return this.selected == undefined || this.selected != this.internalValue ? this.internalValue : this.selected;
        return this.selected == undefined ? this.internalValue : this.selected;
    }

    public set model(value: any) {
        this.internalValue = value;
        console.log('set model: ', value, this.internalValue);
        this.$emit('change', value);
    }

    ///////////////////////////

    protected mounted(): void {
        // this.setItem();
        this.$nextTick(() => {
            this.initLine();
            this.setupScrolllH();
            this.as<ElementQueries>().$on('resize', this.setupScrolllH);
        });
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
    }

    // private scrollToSelectedElem(): void {
    //     setTimeout(() => {
    //         (this.$refs.wrap as HTMLElement).scrollLeft = this.selectedElem.offsetLeft;
    //     }, 0);
    // }

    private setupScrolllH(): void {
        let listEl: HTMLElement = this.$refs.list as HTMLElement;
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let elComputedStyle: any = (this.$el as any).currentStyle || window.getComputedStyle(this.$el);
        let width: number = this.$el.clientWidth - parseInt(elComputedStyle.paddingLeft, 10) -
            parseInt(elComputedStyle.paddingRight, 10) - parseInt(elComputedStyle.borderLeftWidth, 10) -
            parseInt(elComputedStyle.borderRightWidth, 10);
        if (width < listEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            this.hasScrolllH = true;
            wrapEl.style.height = this.computedHeight + 40 + 'px';
            this.$el.style.height = this.computedHeight + 'px';
            // this.scrollToSelectedElem();
        } else {
            this.hasScrolllH = false;
            wrapEl.style.removeProperty('height');
            this.$el.style.removeProperty('height');
        }
    }

    private get ComputedHeight(): string {
        return this.computedHeight + 'px';
    }

    private get isSkinDark(): string {
        return this.skin == 'dark' ? this.skin : 'light';
    }

    private scrollLeft(event: MouseEvent): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let btnsWidth: any = ((this.$refs.buttonLeft as ModulVue).$el as HTMLElement).clientWidth + ((this.$refs.buttonRight as ModulVue).$el as HTMLElement).clientWidth;
        wrapEl.scrollLeft = wrapEl.scrollLeft - ((this.$el.clientWidth - btnsWidth) / 2.5);
    }

    private scrollRight(event: MouseEvent): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let btnsWidth: any = ((this.$refs.buttonLeft as ModulVue).$el as HTMLElement).clientWidth + ((this.$refs.buttonRight as ModulVue).$el as HTMLElement).clientWidth;
        wrapEl.scrollLeft = wrapEl.scrollLeft + ((this.$el.clientWidth - btnsWidth) / 2.5);
    }

    // private setItem(): void {
    //     this.$children.forEach((child, index, arr) => {
    //         if (index == 0 && arr.length >= 1) {
    //             child['isFirst'] = true;
    //         }
    //         if (arr.length - 1 === index && arr.length > 1) {
    //             child['isLast'] = true;
    //         }
    //     });
    // }

    private initLine(): void {
        this.$children.forEach((child, index, arr) => {
            if (child.$props.value == this.selected) {
                if (this.skin == MNavbarSkin.Light) {
                    this.setLinePosition(child.$el);
                }
                if (this.skin == MNavbarSkin.Arrow) {
                    this.setArrowPosition(child.$el);
                }
            }
        });
    }

    private setLinePosition(el: HTMLElement): void {
        if (!this.disabled) {
            this.$nextTick(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        let positionX: number = el.offsetLeft;
                        let width: number = el.clientWidth;
                        let lineEL: HTMLElement = this.$refs.line as HTMLElement;
                        lineEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                        lineEL.style.width = width + 'px';
                        setTimeout(() => {
                            this.isAnimActive = true;
                        });
                    }, 0);
                }, 0);
            });
        }
    }

    private setArrowPosition(el: HTMLElement): void {
        if (!this.disabled) {
            this.$nextTick(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        let positionX: number = el.offsetLeft;
                        let width: number = el.clientWidth;
                        let arrowEL: HTMLElement = this.$refs.Arrow as HTMLElement;
                        arrowEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                        arrowEL.style.width = width + 'px';
                        setTimeout(() => {
                            this.isAnimActive = true;
                        });
                    }, 0);
                }, 0);
            });
        }
    }

    private get hasLine(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Light;
        }
        return this.line;
    }

    private get hasArrow(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Arrow;
        }
        return this.line;
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(NAVBAR_NAME + ' is not ready for production');
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
