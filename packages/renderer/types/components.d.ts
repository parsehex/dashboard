type BootstrapType =
	| 'primary'
	| 'secondary'
	| 'light'
	| 'dark'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info';

type TableDataType = string | number;

interface TableDataObject {
	/** Used if `value` is a number */
	text?: string;
	title?: string;
	value: TableDataType;
}

type TableRowObject = {
	[columnName: string]: TableDataObject;
};

type TableData = TableRowObject[];

type ToggleOptions = { [key: string]: boolean };

interface ActionButton {
	label: string;
	callback: () => void;
}

interface TreeBranch {
	text: string;
	id?: string;
	href?: string;
	children?: ITreeView;
}
type ITreeView = TreeBranch[];

interface SpreadsheetData {
	[sheetName: string]: {
		[columnName: string]: TableDataType;
	}[];
}

interface TabulatorColumnDefinition {
	field: string;
	title: string;
	formatter?: string;
	formatterParams?: any;
	sorter?: string;
}
interface TabulatorSpreadsheetColumnDefs {
	[sheetName: string]: TabulatorColumnDefinition[];
}

type ReportOptions = {
	type: 'date' | 'text';
	key: string;
	label: string;
}[];
interface ChartPresets {
	[sheetName: string]: ChartComponentConfigPreset[];
}
interface ChartComponentConfigPreset {
	type: keyof import('chart.js').ChartTypeRegistry | 'bar-stacked';
	title: string;
	mainColumn: string;
	datasets: {
		key: string;
		color: string | string[];
		label?: string;
		[key: string]: any;
	}[];
}

interface DropdownAction {
	onClick: () => void;
	label: string;
}
type DropdownActions = DropdownAction[];

interface ReportDep {
	type: SupportedFileType;
	key: string;
	common?: boolean;
}
