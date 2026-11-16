/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, expect, it } from 'vitest';
import { format } from '../api';
import { getNumfmtParseValueFilter, isPatternEqualWithoutDecimal } from '../utils';

describe('isPatternEqualWithoutDecimal', () => {
    it('isPatternEqualWithoutDecimal', () => {
        expect(isPatternEqualWithoutDecimal('_(###0.000);-###0.00', '[red]_(###0.0000);-###0.00')).toBe(true);
        expect(isPatternEqualWithoutDecimal('_(###0;-###0.00', '_(###0;[red]-###0.00')).toBe(false);
        expect(isPatternEqualWithoutDecimal('_(###00.0;-###0.00', '_(###0;[red]-###0.00')).toBe(false);
        expect(isPatternEqualWithoutDecimal('_(###0;-###0.00', '_(###0.00;-###0.00')).toBe(true);
    });
});

describe('getNumfmtParseValueFilter', () => {
    it('accepts parenthesized negatives', () => {
        expect(getNumfmtParseValueFilter('(5)')).toEqual({ v: -5, z: '#,##0_);(#,##0)' });
        expect(getNumfmtParseValueFilter('(1,000)')).toEqual({ v: -1000, z: '#,##0' });
        expect(getNumfmtParseValueFilter('($1,000)')).toEqual({ v: -1000, z: '$#,##0' });
        expect(getNumfmtParseValueFilter('(12.34)')).toEqual({ v: -12.34, z: '#,##0.00_);(#,##0.00)' });
    });

    it('still rejects invalid groupings and unbalanced parens', () => {
        expect(getNumfmtParseValueFilter('($1,00)')).toBeNull();
        expect(getNumfmtParseValueFilter('(1,00)')).toBeNull();
        expect(getNumfmtParseValueFilter('($1,000')).toBeNull();
        expect(getNumfmtParseValueFilter('(1,000')).toBeNull();
    });

    it('formats parenthesized negatives back with parens', () => {
        expect(format('#,##0_);(#,##0)', -5)).toBe('(5)');
        expect(format('#,##0.00_);(#,##0.00)', -12.34)).toBe('(12.34)');
    });
});
