// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NewTabLink } from 'common/components/new-tab-link';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
import { DateProvider } from 'common/date-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { FastPassReport, FastPassReportProps } from 'reports/components/fast-pass-report';
import { ReportCollapsibleContainerControl } from 'reports/components/report-sections/report-collapsible-container';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';
import {
    FastPassReportHtmlGenerator,
    FastPassReportModel,
} from 'reports/fast-pass-report-html-generator';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe(FastPassReportHtmlGenerator, () => {
    test('generateHtml', () => {
        const scanDate: Date = new Date(2018, 2, 12, 16, 24);
        const pageTitle: string = 'page-title';
        const pageUrl: string = 'https://page-url/';
        const description: string = 'description';
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const recommendColorMock = Mock.ofType(RecommendColor);
        const getPropertyConfigurationStub = (id: string) => null;
        const cardInteractionSupport = noCardInteractionsSupported;

        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];

        const toolData: ToolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };

        const getScriptMock = Mock.ofInstance(() => '');

        const targetAppInfo = {
            name: pageTitle,
            url: pageUrl,
        };

        const scanMetadata = {
            toolData: toolData,
            targetAppInfo: targetAppInfo,
            timespan: {
                scanComplete: scanDate,
            },
        } as ScanMetadata;

        const model: FastPassReportModel = {
            description,
            scanMetadata,
            results: {
                automatedChecks: {
                    cards: exampleUnifiedStatusResults,
                    visualHelperEnabled: true,
                    allCardsCollapsed: true,
                },
                tabStops: null, // Should be filled in as part of #1897876
            },
        };

        const props: FastPassReportProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                recommendColor: recommendColorMock.object,
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
                getPropertyConfigById: getPropertyConfigurationStub,
                collapsibleControl: ReportCollapsibleContainerControl,
                cardInteractionSupport: cardInteractionSupport,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLink,
            } as SectionDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            recommendColor: recommendColorMock.object,
            description,
            toUtcString: getUTCStringFromDateStub,
            getCollapsibleScript: getScriptMock.object,
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            results: model.results,
            scanMetadata,
        };

        const reportElement: JSX.Element = <FastPassReport {...props} />;

        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(reportElement)))
            .returns(() => '<report-markup />')
            .verifiable(Times.once());

        const testObject = new FastPassReportHtmlGenerator(
            rendererMock.object,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getGuidanceTagsStub,
            fixInstructionProcessorMock.object,
            recommendColorMock.object,
            getPropertyConfigurationStub,
        );

        const actual = testObject.generateHtml(model);

        expect(actual).toMatchSnapshot();
    });
});