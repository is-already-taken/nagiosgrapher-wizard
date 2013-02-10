
define(["views/SliderView",
        "collections/Perfdatas",
        "views/ListPageView",
        "views/WizardView",
        "views/NGrapherTextareaView"], function(SliderView, Perfdatas, ListPageView, WizardView, NGrapherTextareaView) {

	var perfdatas = new Perfdatas([]),
		textarea = new NGrapherTextareaView({collection: perfdatas}),
		listpage = new ListPageView({collection: perfdatas}),
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
		
		resetPerfdata: function(datas){
			perfdatas.reset(datas, {parse: true});
		},
		
		getListpage: function(){
			return listpage;
		}

	});
	
	window.router = new Router();
	
	Backbone.history.start();
	
	return {

	};

});
