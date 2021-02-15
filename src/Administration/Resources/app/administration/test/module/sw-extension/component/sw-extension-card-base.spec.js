import { shallowMount } from '@vue/test-utils';
import 'src/module/sw-extension/component/sw-extension-card-base';

function createWrapper(propsData = {}) {
    return shallowMount(Shopware.Component.build('sw-extension-card-base'), {
        propsData: {
            extension: { installedAt: null },
            ...propsData
        },
        mocks: {
            $tc: v => v
        },
        stubs: {
            'sw-meteor-card': true,
            'sw-switch-field': true,
            'sw-context-button': true,
            'sw-context-menu': true,
            'sw-context-menu-item': true
        },
        provide: {
            shopwareExtensionService: {
                canBeOpened: () => true
            },
            extensionStoreActionService: {},
            cacheApiService: {}
        }
    });
}

describe('src/module/sw-extension/component/sw-extension-card-base', () => {
    /** @type Wrapper */
    let wrapper;

    beforeAll(() => {
        Shopware.Context.api.assetsPath = '';
        Shopware.Utils.debug.warn = () => {};
    });

    beforeEach(async () => {
        wrapper = await createWrapper();
    });

    afterEach(async () => {
        if (wrapper) await wrapper.destroy();
    });

    it('should be a Vue.JS component', async () => {
        expect(wrapper.vm).toBeTruthy();
    });

    it('should contain the correct computed values', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: null,
                permissions: []
            }
        });
    });

    it('should show the short description when it exists', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: null,
                shortDescription: 'My short description',
                description: 'My long description',
                permissions: []
            }
        });

        expect(wrapper.vm.description).toEqual('My short description');
    });

    it('should show the long description as fallback when short does not exists', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: null,
                shortDescription: '',
                description: 'My long description',
                permissions: []
            }
        });

        expect(wrapper.vm.description).toEqual('My long description');
    });

    it('should show the correct image (icon)', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: '845618651',
                icon: 'my-icon',
                permissions: []
            }
        });

        expect(wrapper.vm.image).toEqual('my-icon');
    });

    it('should show the correct image (iconRaw)', async () => {
        const base64Example = 'z87hufieajh38haefwa9hefjio';

        wrapper = await createWrapper({
            extension: {
                installedAt: '845618651',
                iconRaw: base64Example,
                permissions: []
            }
        });

        expect(wrapper.vm.image).toEqual(`data:image/png;base64, ${base64Example}`);
    });

    it('should show the correct image (default theme asset)', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: '845618651',
                permissions: []
            }
        });

        expect(wrapper.vm.image).toEqual('administration/static/img/theme/default_theme_preview.jpg');
    });

    it('should be installed', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: '845618651',
                permissions: []
            }
        });

        expect(wrapper.vm.isInstalled).toEqual(true);
    });

    it('should not be installed', async () => {
        wrapper = await createWrapper({
            extension: {
                installedAt: null
            }
        });

        expect(wrapper.vm.isInstalled).toEqual(false);
    });
});