import { EmptyStateLayoutProps, RawTdProps, RawTrProps, TableProps } from "@strapi/design-system/dist/components";
import { Thead, Tr, Th, Table as DSTable, Tooltip, IconButton, Typography, Flex, Checkbox, Td, Tbody, EmptyStateLayout, Loader } from "@strapi/design-system";
import { CaretDown } from '@strapi/icons';
import { EmptyDocuments } from '@strapi/icons/symbols';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { useControllableState } from "../hooks/useControllableState";
import React from "react";
import { createContext } from "./Context";

interface BaseRow {
    id: string | number;
    [key: string]: any;
}


interface TableHeader<TData = object, THeader = object> {
    cellFormatter?: (data: TData, header: Omit<THeader, 'cellFormatter'>) => React.ReactNode;
    label: string;
    name: string;
    searchable?: boolean;
    sortable?: boolean;
}

interface TableContextValue<TRow extends BaseRow, THeader extends TableHeader<TRow, THeader>>
    extends Pick<TableProps, 'footer'> {
    colCount: number;
    hasHeaderCheckbox: boolean;
    headers: THeader[];
    isLoading: boolean;
    rowCount: number;
    rows: TRow[];
    setHasHeaderCheckbox: (value: boolean) => void;
    selectedRows: TRow[];
    selectRow: (row: TRow | TRow[]) => void;
}

const [TableProvider, useTable] = createContext<TableContextValue<any, any>>('Table');

interface RootProps<TRow extends BaseRow, THeader extends TableHeader<TRow, THeader>>
    extends Partial<
        Pick<
            TableContextValue<TRow, THeader>,
            'footer' | 'headers' | 'isLoading' | 'rows' | 'selectedRows'
        >
    > {
    children?: React.ReactNode;
    defaultSelectedRows?: TRow[];
    onSelectedRowsChange?: (selectedRows: TRow[]) => void;
}

const Root = <TRow extends BaseRow, THeader extends TableHeader<TRow, THeader>>({
    children,
    defaultSelectedRows,
    footer,
    headers = [],
    isLoading = false,
    onSelectedRowsChange,
    rows = [],
    selectedRows: selectedRowsProps,
}: RootProps<TRow, THeader>) => {
    const [selectedRows = [], setSelectedRows] = useControllableState({
        prop: selectedRowsProps,
        defaultProp: defaultSelectedRows,
        onChange: onSelectedRowsChange,
    });
    const [hasHeaderCheckbox, setHasHeaderCheckbox] = React.useState(false);

    const rowCount = rows.length + 1;
    const colCount = hasHeaderCheckbox ? headers.length + 1 : headers.length;

    const selectRow: TableContextValue<TRow, THeader>['selectRow'] = (row) => {
        if (Array.isArray(row)) {
            setSelectedRows(row);
        } else {
            setSelectedRows((prev = []) => {
                const currentRowIndex = prev.findIndex((r) => r.id === row.id);
                if (currentRowIndex > -1) {
                    return prev.toSpliced(currentRowIndex, 1);
                }

                return [...prev, row];
            });
        }
    };

    return (
        <TableProvider
            colCount={colCount}
            hasHeaderCheckbox={hasHeaderCheckbox}
            setHasHeaderCheckbox={setHasHeaderCheckbox}
            footer={footer}
            headers={headers}
            isLoading={isLoading}
            rowCount={rowCount}
            rows={rows}
            selectedRows={selectedRows}
            selectRow={selectRow}
        >
            {children}
        </TableProvider>
    );
};

const Content = ({ children }: Table.ContentProps) => {
    const rowCount = useTable('Content', (state) => state.rowCount);
    const colCount = useTable('Content', (state) => state.colCount);
    const footer = useTable('Content', (state) => state.footer);

    return (
        <DSTable rowCount={rowCount} colCount={colCount} footer={footer}>
            {children}
        </DSTable>
    );
};


const Head = ({ children }: Table.HeadProps) => {
    return (
        <Thead>
            <Tr>{children}</Tr>
        </Thead>
    );
};

const HeaderCell = <TData, THead>({
    name,
    label,
    sortable,
    onSort,
    currentSort,
    currentOrder
}: TableHeader<TData, THead> & {
    onSort?: (name: string, order: 'ASC' | 'DESC') => void;
    currentSort?: string;
    currentOrder?: 'ASC' | 'DESC';
}) => {

    const isSorted = currentSort === name;

    const sortLabel = `Sort on ${label} ${currentOrder === 'ASC' ? 'descending' : 'ascending'}`;


    const handleClickSort = () => {
        if (sortable && onSort) {
            const newOrder = isSorted && currentOrder === 'ASC' ? 'DESC' : 'ASC';
            onSort(name, newOrder);
        }
    };

    return (
        <Th
            action={
                isSorted &&
                sortable && (
                    <IconButton label={sortLabel} onClick={handleClickSort} variant="ghost">
                        <SortIcon $isUp={currentOrder === 'ASC'} />
                    </IconButton>
                )
            }
        >
            <Tooltip label={sortable ? sortLabel : label}>
                <Typography
                    textColor="neutral600"
                    tag={!isSorted && sortable ? 'button' : 'span'}
                    onClick={handleClickSort}
                    variant="sigma"
                >
                    {label}
                </Typography>
            </Tooltip>
        </Th>
    );
};

const SortIcon = styled(CaretDown) <{
    $isUp: boolean;
}>`
    transform: ${({ $isUp }) => `rotate(${$isUp ? '180' : '0'}deg)`};
  `;

const ActionBar = ({ children }: Table.ActionBarProps) => {
    const { formatMessage } = useIntl();
    const selectedRows = useTable('ActionBar', (state) => state.selectedRows);

    if (selectedRows.length === 0) return null;

    return (
        <Flex gap={2}>
            <Typography variant="omega" textColor="neutral500">
                {selectedRows.length} {"entrée(s) sélectionnée(s)"}
            </Typography>
            {children}
        </Flex>
    );
};

const HeaderCheckboxCell = () => {
    const rows = useTable('HeaderCheckboxCell', (state) => state.rows);
    const selectedRows = useTable('HeaderCheckboxCell', (state) => state.selectedRows);
    const selectRow = useTable('HeaderCheckboxCell', (state) => state.selectRow);
    const setHasHeaderCheckbox = useTable(
        'HeaderCheckboxCell',
        (state) => state.setHasHeaderCheckbox
    );


    const areAllEntriesSelected = selectedRows.length === rows.length && rows.length > 0;
    const isIndeterminate = !areAllEntriesSelected && selectedRows.length > 0;

    React.useEffect(() => {
        setHasHeaderCheckbox(true);

        return () => setHasHeaderCheckbox(false);
    }, [setHasHeaderCheckbox]);

    const handleSelectAll = () => {
        if (!areAllEntriesSelected) {
            selectRow(rows);
        } else {
            selectRow([]);
        }
    };

    return (
        <Th>
            <Checkbox
                aria-label={"Select all entries"}
                disabled={rows.length === 0}
                checked={isIndeterminate ? 'indeterminate' : areAllEntriesSelected}
                onCheckedChange={handleSelectAll}
            />
        </Th>
    );
};

const Empty = (props: Table.EmptyProps) => {

    const rows = useTable('Empty', (state) => state.rows);
    const isLoading = useTable('Empty', (state) => state.isLoading);
    const colCount = useTable('Empty', (state) => state.colCount);

    /**
     * If we're loading or we have some data, we don't show the empty state.
     */
    if (rows.length > 0 || isLoading) {
        return null;
    }

    return (
        <Tbody>
            <Tr>
                <Td colSpan={colCount}>
                    <EmptyStateLayout
                        content={"No content"}
                        hasRadius
                        icon={<EmptyDocuments width="16rem" />}
                        {...props}
                    />
                </Td>
            </Tr>
        </Tbody>
    );
};

const Loading = ({ children = 'Loading content' }: Table.LoadingProps) => {
    const isLoading = useTable('Loading', (state) => state.isLoading);
    const colCount = useTable('Loading', (state) => state.colCount);

    if (!isLoading) {
        return null;
    }

    return (
        <Tbody>
            <Tr>
                <Td colSpan={colCount}>
                    <Flex justifyContent="center" padding={11} background="neutral0">
                        <Loader>{children}</Loader>
                    </Flex>
                </Td>
            </Tr>
        </Tbody>
    );
};

const Body = ({ children }: Table.BodyProps) => {
    const isLoading = useTable('Body', (state) => state.isLoading);
    const rows = useTable('Body', (state) => state.rows);

    if (isLoading || rows.length === 0) {
        return null;
    }

    return <Tbody>{children}</Tbody>;
};

const Row = (props: Table.RowProps) => {
    return <Tr {...props} />;
};


const Cell = (props: Table.CellProps) => {
    return <Td {...props} />;
};

const CheckboxCell = ({ id, ...props }: Table.CheckboxCellProps) => {
    const rows = useTable('CheckboxCell', (state) => state.rows);
    const selectedRows = useTable('CheckboxCell', (state) => state.selectedRows);
    const selectRow = useTable('CheckboxCell', (state) => state.selectRow);

    const { formatMessage } = useIntl();

    const handleSelectRow = () => {
        selectRow(rows.find((row) => row.id === id));
    };

    const isChecked = selectedRows.findIndex((row) => row.id === id) > -1;

    return (
        <Cell {...props} onClick={(e) => e.stopPropagation()}>
            <Checkbox
                aria-label={formatMessage(
                    {
                        id: 'app.component.table.select.one-entry',
                        defaultMessage: `Select {target}`,
                    },
                    { target: id }
                )}
                disabled={rows.length === 0}
                checked={isChecked}
                onCheckedChange={handleSelectRow}
            />
        </Cell>
    );
};

const Table = {
    Root,
    Content,
    ActionBar,
    Head,
    HeaderCell,
    HeaderCheckboxCell,
    Body,
    CheckboxCell,
    Cell,
    Row,
    Loading,
    Empty,
};

namespace Table {
    export type Props<
        TData extends BaseRow,
        THeader extends TableHeader<TData, THeader> = TableHeader<TData, TableHeader>,
    > = RootProps<TData, THeader>;
    export interface ActionBarProps {
        children?: React.ReactNode;
    }

    export interface ContentProps {
        children: React.ReactNode;
    }

    export type Header<TData, THeader> = TableHeader<TData, THeader>;

    export interface HeadProps {
        children: React.ReactNode;
    }

    export interface EmptyProps extends Partial<EmptyStateLayoutProps> { }

    export interface LoadingProps {
        children?: React.ReactNode;
    }

    export interface BodyProps {
        children: React.ReactNode;
    }

    export interface RowProps extends RawTrProps { }

    export interface CellProps extends RawTdProps { }

    export interface CheckboxCellProps extends Pick<BaseRow, 'id'>, Omit<RawTdProps, 'id'> { }
}

export { Table, useTable };
export type { TableHeader, BaseRow };