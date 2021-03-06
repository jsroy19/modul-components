import filesize from 'filesize';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import FileDropPlugin from '../../directives/file-drop/file-drop';
import FilePlugin, { MFile, MFileRejectionCause, MFileStatus } from '../../utils/file/file';
import { Messages } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { FILE_UPLOAD_NAME } from '../component-names';
import DialogPlugin, { MDialog } from '../dialog/dialog';
import FileSelectPlugin from '../file-select/file-select';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import ProgressPlugin, { MProgressState } from '../progress/progress';
import WithRender from './file-upload.html?style=./file-upload.scss';

const COMPLETED_FILES_VISUAL_HINT_DELAY: number = 1000;

interface MFileExt extends MFile {
    completeHinted: boolean;
    isOldRejection: boolean;
}

let filesizeSymbols: { [name: string]: string } | undefined = undefined;

@WithRender
@Component({
    filters: {
        fileSize(bytes: number): string {
            if (!filesizeSymbols) {
                const i18n: Messages = (Vue.prototype as any).$i18n;
                filesizeSymbols = {
                    B: i18n.translate('m-file-upload:size-b'),
                    KB: i18n.translate('m-file-upload:size-kb'),
                    MB: i18n.translate('m-file-upload:size-mb'),
                    GB: i18n.translate('m-file-upload:size-gb')
                };
            }

            return filesize(bytes, {
                symbols: filesizeSymbols
            });
        }
    }
})
export class MFileUpload extends ModulVue {
    @Prop()
    public extensions?: string[];
    @Prop()
    public maxSizeKb?: number;
    @Prop()
    public maxFiles?: number;

    $refs: {
        dialog: MDialog;
    };

    private title: string = this.$i18n.translate('m-file-upload:header-title');

    private created(): void {
        this.$file.setValidationOptions({
            extensions: this.extensions,
            maxSizeKb: this.maxSizeKb,
            maxFiles: this.maxFiles
        });
    }

    @Watch('readyFiles')
    private onFilesChanged(): void {
        const newReadyFiles: MFileExt[] = [];

        for (const f of this.readyFiles) {
            if (!f.hasOwnProperty('completeHinted')) {
                this.$set(f, 'completeHinted', false);
                newReadyFiles.push(f);
            }
        }

        if (newReadyFiles.length > 0) {
            this.$emit('files-ready', this.readyFiles);
        }
    }

    @Watch('freshlyCompletedFiles')
    private onFreshlyCompletedFilesChanged(): void {
        if (this.freshlyCompletedFiles.length > 0) {
            setTimeout(() => {
                for (const f of this.freshlyCompletedFiles) {
                    f.completeHinted = true;
                }
            }, COMPLETED_FILES_VISUAL_HINT_DELAY);
        }
    }

    @Watch('rejectedFiles')
    private onFilesRejected(): void {
        const nbNewRejection = this.rejectedFiles.reduce((cnt, f) => {
            let nbNewRejection = 0;
            if (!f.isOldRejection) {
                ++nbNewRejection;
                f.isOldRejection = true;
            }
            return cnt + nbNewRejection;
        }, 0);

        if (nbNewRejection > 0) {
            this.$refs.dialog.$refs.body.scrollTop = 0;
            // TODO Change function to have a smooth scroll when it will work on a diferent element than the body of the page
            // ScrollTo.startScroll(bodyRef, 0, ScrollToDuration.Regular);
        }
    }

    private onMessageClose(): void {
        for (const f of this.rejectedFiles) {
            this.$file.remove(f.uid);
        }
    }

    private onAddClick(): void {
        this.$refs.dialog.closeDialog();
        this.$emit('done', this.completedFiles);
        this.$file.clear();
    }

    private onCancelClick(): void {
        this.$refs.dialog.closeDialog();
        this.allFiles
            .filter(f => f.status === MFileStatus.UPLOADING)
            .forEach(this.onUploadCancel);
        this.$emit('cancel');
        this.$file.clear();
    }

    private onUploadCancel(file: MFile): void {
        file.status === MFileStatus.UPLOADING
            ? this.$emit('file-upload-cancel', file)
            : this.onFileRemove(file);
    }

    private onFileRemove(file: MFile): void {
        this.$emit('file-remove', file);
        this.$file.remove(file.uid);
    }

    private onOpen(): void {
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close');
    }

    private getFileStatus(file): string {
        if (file.status === MFileStatus.FAILED) {
            return MProgressState.Error;
        } else if (file.status === MFileStatus.COMPLETED) {
            return MProgressState.Completed;
        } else {
            return MProgressState.InProgress;
        }
    }

    private hasExtensionsRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_TYPE;
    }

    private hasSizeRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_SIZE;
    }

    private hasMaxFilesRejection(file): boolean {
        return file.rejection === MFileRejectionCause.MAX_FILES;
    }

    private get fileExtensions(): string {
        return this.extensions ? this.extensions.join(', ') : '';
    }

    private get isAddBtnEnabled(): boolean {
        return (
            this.completedFiles.length > 0 && this.uploadingFiles.length === 0
        );
    }

    private get readyFiles(): MFileExt[] {
        return this.allFiles.filter(f => f.status === MFileStatus.READY);
    }

    private get freshlyCompletedFiles(): MFileExt[] {
        return this.allFiles.filter(
            f => f.status === MFileStatus.COMPLETED && !f.completeHinted
        );
    }

    private get uploadingFiles(): MFileExt[] {
        return this.allFiles.filter(
            f =>
                f.status === MFileStatus.UPLOADING ||
                f.status === MFileStatus.FAILED ||
                (f.status === MFileStatus.COMPLETED && !f.completeHinted)
        );
    }

    private get completedFiles(): MFileExt[] {
        return this.allFiles.filter(
            f => f.status === MFileStatus.COMPLETED && f.completeHinted
        );
    }

    private get rejectedFiles(): MFileExt[] {
        return this.allFiles.filter(f => f.status === MFileStatus.REJECTED);
    }

    private get allFiles(): MFileExt[] {
        return this.$file.files() as MFileExt[];
    }

    private get hasUploadingFiles(): boolean {
        return this.uploadingFiles.length === 0;
    }

    private get hasCompletedFiles(): boolean {
        return this.completedFiles.length === 0;
    }

    private get hasRejectedFiles(): boolean {
        return this.rejectedFiles.length !== 0;
    }
}

const FileUploadPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(FILE_UPLOAD_NAME, 'plugin.install');
        v.use(FilePlugin);
        v.use(FileDropPlugin);
        v.use(FileSelectPlugin);
        v.use(DialogPlugin);
        v.use(ProgressPlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(MessagePlugin);
        v.use(LinkPlugin);
        v.component(FILE_UPLOAD_NAME, MFileUpload);
    }
};

export default FileUploadPlugin;
