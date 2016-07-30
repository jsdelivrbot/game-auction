import template from './template.html!text';
import ctrl from './ctrl';

export default {
	bindings: {
		userId: '<'
	},
	template,
	controller: ['$scope', '$timeout',  'playerService', ctrl]
}