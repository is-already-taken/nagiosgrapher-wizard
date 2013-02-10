
define(["views/SliderView",
        "models/NGrapher",
        "views/ListPageView",
        "views/WizardView",
        "views/NGrapherTextareaView"], function(SliderView, NGrapher, ListPageView, WizardView, NGrapherTextareaView) {

	var ngrapher = new NGrapher(),
		textarea = new NGrapherTextareaView({model: ngrapher}),
		listpage = new ListPageView({collection: ngrapher.perfdatas}),
		wizardView = new WizardView(),
		sliderView = new SliderView();
	
	$("#grapher-config").append(textarea.$el);
	
	listpage.render();
	
	var Router = Backbone.Router.extend({

		routes: {
			"wizard" : "wizard",
		    "list"	 : "list",
		    "configs" : "configs",
		    ".*"	 : "def"
		},
		
		wizard: function() {
			sliderView.slideToWizard();
		},
		
		list: function() {
			sliderView.slideToList();
		},
		
		configs: function() {
			sliderView.slideToConfigs();
		},
		
		def: function(){
			this.navigate("wizard");
		},
		
		getListpage: function(){
			return listpage;
		}

	});
	
	window.router = new Router();
	window.ngrapher = ngrapher;
	
	Backbone.history.start();
	
	return {

	};

});
