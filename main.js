
define(["views/SliderView",
        "collections/Perfdatas",
        "views/PerfdataListView",
        "views/WizardView",
        "views/NGrapherTextareaView",
        "utils/PerfdataParser"], function(SliderView, Perfdatas, PerfdataListView, WizardView, NGrapherTextareaView, PerfdataParser) {
	
	var DEFAULTS = {
			LEGEND: [
			         {"function": "AVERAGE", "description": "Avg: "},
			         {"function": "MIN", "description": "Min: "},
			         {"function": "MAX", "description": "Max: "},
			         {"function": "LAST", "description": "Last: ", active: true}
	        ]
	};

	var perfdatas = new Perfdatas([]),
		pdw = new PerfdataListView({collection: perfdatas}),
		textarea = new NGrapherTextareaView({collection: perfdatas}),
		wizardView = new WizardView();
	
	perfdatas.on("add", function(){
		$("#perfdata-box").scrollTop(
		    $("#perfdata-list").outerHeight()
		);
	});
	
	$("#perfdata-list").append(pdw.$el);
	$("#grapher-config").append(textarea.$el);
	
	
	var sliderView = new SliderView();
	
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
