import Vue, { PluginObject } from 'vue';

import AccordionGroupPlugin from './accordion-group/accordion-group';
import AccordionPlugin from './accordion/accordion';
import ButtonGroupPlugin from './button-group/button-group';
import ButtonPlugin from './button/button';
import CarouselItemPlugin from './carousel-item/carousel-item';
import CarouselPlugin from './carousel/carousel';
import CheckboxPlugin from './checkbox/checkbox';
import DatefieldsPlugin from './datefields/datefields';
import DatepickerPlugin from './datepicker/datepicker';
import DialogPlugin from './dialog/dialog';
import DropdownGroupPlugin from './dropdown-group/dropdown-group';
import DropdownItemPlugin from './dropdown-item/dropdown-item';
import DropdownPlugin from './dropdown/dropdown';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import EditWindow from './edit-window/edit-window';
import FileSelectPlugin from './file-select/file-select';
import FileUploadPlugin from './file-upload/file-upload';
import FlexTemplatePlugin from './flex-template/flex-template';
import I18nPlugin from './i18n/i18n';
import IconButtonPlugin from './icon-button/icon-button';
import IconPlugin from './icon/icon';
import InputStylePlugin from './input-style/input-style';
import LimitTextPlugin from './limit-text/limit-text';
import LinkPlugin from './link/link';
import ListItemPlugin from './list-item/list-item';
import menuItemPlugin from './menu-item/menu-item';
import menuPlugin from './menu/menu';
import MessagePlugin from './message/message';
import ModalPlugin from './modal/modal';
import NavbarItemPlugin from './navbar-item/navbar-item';
import NavbarPlugin from './navbar/navbar';
import PanelPlugin from './panel/panel';
import PhoneNumberPlugin from './phone-number/phone-number';
import PopperPlugin from './popper/popper';
import PopupPlugin from './popup/popup';
import ProgressPluggin from './progress/progress';
import RadioGroupPlugin from './radio-group/radio-group';
import RadioPlugin from './radio/radio';
import RadioStylePlugin from './radio-style/radio-style';
import ScrollTopPlugin from './scroll-top/scroll-top';
import SidebarPlugin from './sidebar/sidebar';
import SliderPlugin from './slider/slider';
import SpinnerPlugin from './spinner/spinner';
import Status from './status/status';
import StepPlugin from './step/step';
import SteppersItemPlugin from './steppers-item/steppers-item';
import SteppersPlugin from './steppers/steppers';
import SwitchPlugin from './switch/switch';
import TabPanelPlugin from './tab-panel/tab-panel';
import TabsPlugin from './tabs/tabs';
import TemplatePlugin from './template/template';
import TextareaPlugin from './textarea/textarea';
import TextareaResizePlugin from './textarea-resize/textarea-resize';
import TextfieldPlugin from './textfield/textfield';
import TimepickerPlugin from './timepicker/timepicker';
import TooltipPlugin from './tooltip/tooltip';
import UploadPlugin from './upload/upload';
import UploadInputPlugin from './upload-input/upload-input';
import UploadDragdropPlugin from './upload-dragdrop/upload-dragdrop';
import UploadFileslistPlugin from './upload-fileslist/upload-fileslist';
import ValidationMessagePlugin from './validation-message/validation-message';
import WrapperInlineEditionPlugin from './wrapper-inline-edition/wrapper-inline-edition';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(AccordionGroupPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(ButtonGroupPlugin);
        Vue.use(CarouselPlugin);
        Vue.use(CarouselItemPlugin);
        Vue.use(CheckboxPlugin);
        Vue.use(DatefieldsPlugin);
        Vue.use(DatepickerPlugin);
        Vue.use(DialogPlugin);
        Vue.use(DropdownPlugin);
        Vue.use(DropdownItemPlugin);
        Vue.use(DropdownGroupPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(EditWindow);
        Vue.use(FileSelectPlugin);
        Vue.use(FileUploadPlugin);
        Vue.use(FlexTemplatePlugin);
        Vue.use(I18nPlugin);
        Vue.use(IconPlugin);
        Vue.use(IconButtonPlugin);
        Vue.use(InputStylePlugin);
        Vue.use(LimitTextPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListItemPlugin);
        Vue.use(MessagePlugin);
        Vue.use(ModalPlugin);
        Vue.use(NavbarPlugin);
        Vue.use(NavbarItemPlugin);
        Vue.use(menuPlugin);
        Vue.use(menuItemPlugin);
        Vue.use(PanelPlugin);
        Vue.use(PhoneNumberPlugin);
        Vue.use(PopperPlugin);
        Vue.use(PopupPlugin);
        Vue.use(ProgressPluggin);
        Vue.use(RadioPlugin);
        Vue.use(RadioGroupPlugin);
        Vue.use(RadioStylePlugin);
        Vue.use(ScrollTopPlugin);
        Vue.use(SidebarPlugin);
        Vue.use(SliderPlugin);
        Vue.use(SpinnerPlugin);
        Vue.use(Status);
        Vue.use(StepPlugin);
        Vue.use(SteppersPlugin);
        Vue.use(SteppersItemPlugin);
        Vue.use(SwitchPlugin);
        Vue.use(TabPanelPlugin);
        Vue.use(TabsPlugin);
        Vue.use(TemplatePlugin);
        Vue.use(TextareaPlugin);
        Vue.use(TextareaResizePlugin);
        Vue.use(TextfieldPlugin);
        Vue.use(TimepickerPlugin);
        Vue.use(TooltipPlugin);
        Vue.use(UploadPlugin);
        Vue.use(UploadInputPlugin);
        Vue.use(UploadDragdropPlugin);
        Vue.use(UploadFileslistPlugin);
        Vue.use(ValidationMessagePlugin);
        Vue.use(WrapperInlineEditionPlugin);
    }
};

export default ComponentsPlugin;
