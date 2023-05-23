interface UIConfig {
    showRemovedProperties: boolean;
}

interface HeaderConfig {
    showAppTitle: boolean;
    showHeaderMenu: boolean;
    showMainNavigation: boolean;
    showPageHeader: boolean;
}

namespace FLOWABLE {
    export let UI_CONFIG: UIConfig = {
        showRemovedProperties: false
    };

    export let HEADER_CONFIG: HeaderConfig = {
        showAppTitle: true,
        showHeaderMenu: true,
        showMainNavigation: true,
        showPageHeader: true
    };
}