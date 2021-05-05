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
	children?: TreeView;
}
type TreeView = TreeBranch[];

interface SpreadsheetData {
	[sheetName: string]: {
		[columnName: string]: TableDataType;
	}[];
}
