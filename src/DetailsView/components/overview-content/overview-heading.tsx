// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import styles from './overview-heading.scss';

export const overviewHeadingAutomationId = 'overview-heading';

export type OverviewHeadingProps = {
    introText: string;
};

export const OverviewHeading = NamedFC('OverviewHeading', (props: OverviewHeadingProps) => {
    return (
        <>
            <div
                className={styles.overviewHeading}
                data-automation-id={overviewHeadingAutomationId}
            >
                <h1>Overview</h1>
                {props.introText}
            </div>
        </>
    );
});
