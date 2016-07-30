// Bootstrap app
import angular from 'angular';
import main from 'app/components/main/module';

angular.element(document).ready(function() {
	angular.bootstrap(document, [main], {
		strictDi: true
	});
});