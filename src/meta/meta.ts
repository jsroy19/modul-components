import Vue from 'vue';

export type Preview = string | boolean;

export interface ComponentAttribute {
    type: string;
    values: string[];
    default?: number;
    origin?: ComponentMeta;
}

export interface ComponentMethodArgument {
    name: string;
    type: string;
    description: string;
}

export interface ComponentMethodReturn {
    type: string;
    description: string;
}

export interface ComponentMethod {
    description: string;
    arguments: ComponentMethodArgument[];
    return?: ComponentMethodReturn;
}

export interface ComponentAttributes {
    [attribute: string]: ComponentAttribute;
}

export interface ComponentMethods {
    [method: string]: ComponentMethod;
}

export interface ComponentMeta {
    tag: string;
    attributes?: ComponentAttributes;
    mixins?: string[];
    methods?: ComponentMethods;
}

export type ComponentMetaMap = {
    [key: string]: ComponentMeta;
};

export class Meta {
    private componentMeta: ComponentMetaMap = {};

    // constructor() {
    //     components.forEach(componentTag => {
    //         this.componentMeta[componentTag] = { tag: componentTag };
    //     });

    //     directives.forEach(directiveTag => {
    //         this.componentMeta[directiveTag] = { tag: directiveTag };
    //     });

    //     mixins.forEach(mixinTag => {
    //         this.componentMeta[mixinTag] = { tag: mixinTag };
    //     });
    // }

    public mergeComponentMeta(tag: string, meta: ComponentMeta): ComponentMeta {
        let metaObject: ComponentMeta = this.componentMeta[tag];
        if (!metaObject) {
            metaObject = { tag: tag };
        }
        let mergedMeta: ComponentMeta = { ...metaObject, ...meta };
        this.componentMeta[tag] = mergedMeta;

        if (mergedMeta.mixins) {
            mergedMeta.mixins.forEach(mixin => {
                this.mergeComponentAttributes(mergedMeta, mixin);
            });
        }

        return mergedMeta;
    }

    public getMeta(): ComponentMeta[] {
        return Object.keys(this.componentMeta).filter(key => this.componentMeta.hasOwnProperty(key)).map(key => this.componentMeta[key]);
    }

    public getTags(): string[] {
        return Object.keys(this.componentMeta).filter(key => this.componentMeta.hasOwnProperty(key));
    }

    public getMetaByTag(tag: string): ComponentMeta {
        return this.componentMeta[tag];
    }

    public getComponentAttributes(componentMeta: ComponentMeta): string[] {
        if (componentMeta.attributes) {
            return Object.keys(componentMeta.attributes).filter(key => componentMeta.attributes && componentMeta.attributes.hasOwnProperty(key));
        } else {
            return [];
        }
    }

    private mergeComponentAttributes(componentMeta: ComponentMeta, mixin: string): void {
        let mixinMeta: ComponentMeta = this.componentMeta[mixin];
        if (!mixinMeta) {
            throw new Error(`There is not meta information for mixin ${mixin}. Make sure to call the mergeComponentMeta('${mixin}', '<path-to-meta.json>', ...) method or to register the mixin before the ${componentMeta.tag} component.`);
        }
        if (mixinMeta.attributes) {
            Object.keys(mixinMeta.attributes)
                .filter(key => mixinMeta.attributes && mixinMeta.attributes.hasOwnProperty(key))
                .forEach(attribute => {
                    if (mixinMeta.attributes) {
                        mixinMeta.attributes[attribute].origin = mixinMeta;
                    }
                });
            componentMeta.attributes = { ...componentMeta.attributes, ...mixinMeta.attributes };
            if (mixinMeta.mixins) {
                mixinMeta.mixins.forEach(mixin => {
                    this.mergeComponentAttributes(componentMeta, mixin);
                });
            }
        }
    }
}

export default new Meta();
