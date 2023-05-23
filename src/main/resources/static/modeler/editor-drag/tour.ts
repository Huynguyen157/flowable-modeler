interface TourStep {
    orphan?: boolean;
    title: string;
    content: string;
    element?: string;
    placement?: string;
    template: string;
    onNext?: () => void;
}

interface TourOptions {
    name: string;
    storage: boolean | Storage;
    container: string;
    backdrop: boolean;
    keyboard: boolean;
    steps: TourStep[];
    onEnd: () => void;
}

class Tour {
    private steps: TourStep[];
    private currentStep: number;

    constructor(private options: TourOptions) {
        this.steps = options.steps;
        this.currentStep = 0;
    }

    public init(): void {
        // Initialize the tour
    }

    public start(): void {
        // Start the tour
    }
}

namespace FLOWABLE_EDITOR_TOUR {
    const jQuery = window['jQuery'];

    export function gettingStarted($scope, $translate, $q, useLocalStorage): void {
        const userName = $scope.account.firstName ? $scope.account.firstName : $scope.account.fullname;

        $q.all([
            $translate('TOUR.WELCOME-TITLE', { userName }),
            $translate('TOUR.WELCOME-CONTENT'),
            $translate('TOUR.PALETTE-TITLE'),
            $translate('TOUR.PALETTE-CONTENT'),
            $translate('TOUR.CANVAS-TITLE'),
            $translate('TOUR.CANVAS-CONTENT'),
            $translate('TOUR.DRAGDROP-TITLE'),
            $translate('TOUR.DRAGDROP-CONTENT'),
            $translate('TOUR.PROPERTIES-TITLE'),
            $translate('TOUR.PROPERTIES-CONTENT'),
            $translate('TOUR.TOOLBAR-TITLE'),
            $translate('TOUR.TOOLBAR-CONTENT'),
            $translate('TOUR.END-TITLE'),
            $translate('TOUR.END-CONTENT')
        ]).then(function (translations) {
            const tourStepDomElements = ['body', '#paletteHelpWrapper', '#canvasHelpWrapper', '#propertiesHelpWrapper', '#editor-header'];

            const tour: Tour = new Tour({
                name: 'activitiEditorTour',
                storage: useLocalStorage ? window.localStorage : false,
                container: 'body',
                backdrop: true,
                keyboard: true,
                steps: [
                    {
                        orphan: true,
                        title: translations[0],
                        content: translations[1],
                        template: _buildStepTemplate(false, true, false, 300),
                        onNext: _buildOnNextFunction(tourStepDomElements[0])
                    },
                    {
                        element: tourStepDomElements[1],
                        title: translations[2],
                        content: translations[3],
                        template: _buildStepTemplate(false, true, false, 400, 'images/tour/open-group.gif'),
                        onNext: _buildOnNextFunction(tourStepDomElements[1])
                    },
                    {
                        element: tourStepDomElements[2],
                        title: translations[4],
                        content: translations[5],
                        placement: 'left',
                        template: _buildStepTemplate(false, true, false, 400),
                        onNext: _buildOnNextFunction(tourStepDomElements[2])
                    },
                    {
                        orphan: true,
                        title: translations[6],
                        content: translations[7],
                        template: _buildStepTemplate(false, true, false, 720, 'images/tour/tour-dnd.gif'),
                        onNext: _buildOnNextFunction(tourStepDomElements[0])
                    },
                    {
                        element: tourStepDomElements[3],
                        title: translations[8],
                        content: translations[9],
                        placement: 'top',
                        template: _buildStepTemplate(false, true, false, 400),
                        onNext: _buildOnNextFunction(tourStepDomElements[3])
                    },
                    {
                        element: tourStepDomElements[4],
                        title: translations[10],
                        content: translations[11],
                        placement: 'bottom',
                        template: _buildStepTemplate(false, true, false, 400),
                        onNext: _buildOnNextFunction(tourStepDomElements[4])
                    },
                    {
                        orphan: true,
                        title: translations[12],
                        content: translations[13],
                        template: _buildStepTemplate(false, false, true, 400),
                        onNext: _buildOnNextFunction(tourStepDomElements[0])
                    }
                ],
                onEnd: _buildOnEndFunction(tourStepDomElements)
            });

            tour.init();
            tour.start();
        });
    }

    export function sequenceFlowBendpoint($scope, $translate, $q, useLocalStorage): void {
        $q.all([
            $translate('FEATURE-TOUR.BENDPOINT.TITLE'),
            $translate('FEATURE-TOUR.BENDPOINT.DESCRIPTION')
        ]).then(function (translations) {
            const tourStepDomElements = ['body'];

            const tour: Tour = new Tour({
                name: 'bendpointTour',
                storage: useLocalStorage ? window.localStorage : false,
                container: 'body',
                backdrop: true,
                keyboard: true,
                steps: [
                    {
                        orphan: true,
                        title: translations[0],
                        content: translations[1],
                        template: _buildStepTemplate(false, false, true, 500, 'images/tour/sequenceflow-bendpoint.gif'),
                        onNext: _buildOnNextFunction(tourStepDomElements[0])
                    }
                ],
                onEnd: _buildOnEndFunction(tourStepDomElements)
            });

            tour.init();
            tour.start();
        });
    }

    function _buildStepTemplate(addPrevButton: boolean, addNextButton: boolean, addEndTourButton: boolean, optionalForcedWidth: number, image?: string): string {
        let width = 200;
        if (optionalForcedWidth) {
            width = optionalForcedWidth;
        }

        let template =
            `<div class='popover tour' style='max-width:${width}px'>` +
            `<div class='arrow'></div>` +
            `<h3 class='popover-title'></h3>` +
            `<div class='popover-content'></div>` +
            `<div class='popover-navigation'>`;

        if (image) {
            template += `<div><img src='${image}' style='border: 1px solid black; margin: 5px 0 5px 0;'></img></div>`;
        }

        if (addPrevButton) {
            template += `<button class='btn btn-sm btn-default' data-role='prev'>« Prev</button>`;
        }

        if (addNextButton) {
            template += `<button class='btn btn-sm btn-default' data-role='next' style='float: right'>Next »</button>`;
        }

        if (addEndTourButton) {
            template += `<button class='btn btn-warning btn-sm' data-role='end' style='float: right'>Got it!</button>`;
        }

        template += `</div>` +
            `</nav>` +
            `</div>`;

        return template;
    }

    function _buildOnNextFunction(selector: string): () => void {
        return function () {
            jQuery(selector).each(function (i, obj) {
                obj.style.display = 'block';
            });
        };
    }

    function _buildOnEndFunction(selectors: string[]): () => void {
        return function () {
            for (let elementsToResetIndex = 0; elementsToResetIndex < selectors.length; elementsToResetIndex++) {
                jQuery(selectors[elementsToResetIndex]).each(function (i, obj) {
                    obj.style.display = 'block';
                });
            }
        };
    }
}
