
define(["views/SliderView",
        "collections/Perfdatas",
        "views/ListPageView",
        "views/WizardView",
        "views/NGrapherTextareaView",
        "utils/PerfdataParser"], function(SliderView, Perfdatas, ListPageView, WizardView, NGrapherTextareaView, PerfdataParser) {
	
	var DEFAULTS = {
			LEGEND: [
			         {"function": "AVERAGE", "description": "Avg: "},
			         {"function": "MIN", "description": "Min: "},
			         {"function": "MAX", "description": "Max: "},
			         {"function": "LAST", "description": "Last: ", active: true}
	        ]
	};

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
			var perfdata,
				tokens, matchers, variables,
				rawDatas = [],
				variable,
				matcher,
				i;
			
			perfdata = wizardView.getPerfdata();
			
			tokens = PerfdataParser.getTokened(perfdata);
			matchers = PerfdataParser.getMatchers(tokens);
			variables = PerfdataParser.getVariables(tokens);
			
			for (i = 0; i < matchers.length; i++) {
				variable = variables[i];
				matcher = matchers[i];
				
				rawDatas.push({
					variable: variable,
					regex: matcher,
					plot: {type: "line-2", color: "#f00"},
					legends: DEFAULTS.LEGEND
				});
			}
			
			perfdatas.reset(rawDatas, {parse: true});
			
			listpage.show(perfdata);
			
			sliderView.slideToList();
		},
		
		configs: function() {
			sliderView.slideToConfigs();
		},
		
		def: function(){
			this.navigate("wizard");
		}

	});
	
	window.router = new Router();
	
	Backbone.history.start();
	
	return {

	};

});
