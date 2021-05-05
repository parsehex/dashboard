export type FileModuleConfig = { [key in FileType]: DataTypeConfig };

export interface DataTypeConfig {
	version: number;
	name: FileType;
	name_long: string;
	component: ReturnType<typeof import('vue')['defineComponent']>;
	mergeable: boolean;
	description?: string;
	reports?: string[];
	dataSource: string;
	disabled: boolean;
}
