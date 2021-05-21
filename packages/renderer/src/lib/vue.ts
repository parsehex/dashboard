import { createApp } from 'vue';

import Alert from '@/components/common/Alert.vue';
import Btn from '@/components/common/Btn.vue';
import Card from '@/components/common/Card.vue';
import Column from '@/components/common/Layout/Column.vue';
import Container from '@/components/common/Layout/Container.vue';
// import DataTable from '@/components/common/DataTable.vue';
// import ToggleDropdown from '@/components/common/ToggleDropdown.vue';
import Spreadsheet from '@/components/Spreadsheet.vue';
import Icon from '@/components/common/Icon.vue';
import ListGroup from '@/components/common/ListGroup/ListGroup.vue';
import ListGroupItem from '@/components/common/ListGroup/ListGroupItem.vue';
import ListGroupLink from '@/components/common/ListGroup/ListGroupLink.vue';
import Row from '@/components/common/Layout/Row.vue';
import App from '@/App.vue';

import router from '../router';

export const app = createApp(App);

const clickOutside = {
	beforeMount: (el: any, binding: any) => {
		el.clickOutsideEvent = (event: any) => {
			if (!(el == event.target || el.contains(event.target))) {
				binding.value();
			}
		};
		document.addEventListener('click', el.clickOutsideEvent);
	},
	unmounted: (el: any) => {
		document.removeEventListener('click', el.clickOutsideEvent);
	},
};
app.directive('click-outside', clickOutside);

export function setupVue(el: string | Element) {
	app.component(Alert.name, Alert);
	app.component(Btn.name, Btn);
	app.component(Card.name, Card);
	app.component(Column.name, Column);
	app.component(Container.name, Container);
	app.component(Spreadsheet.name, Spreadsheet);
	// app.component(ToggleDropdown.name, ToggleDropdown);
	// app.component(FormGroup.name, FormGroup);
	app.component(Icon.name, Icon);
	app.component(ListGroup.name, ListGroup);
	app.component(ListGroupItem.name, ListGroupItem);
	app.component(ListGroupLink.name, ListGroupLink);
	app.component(Row.name, Row);

	app.use(router);
	app.mount(el);
}
