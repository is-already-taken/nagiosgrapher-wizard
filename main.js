
define(["views/SliderView",
        "collections/Perfdatas",
        "views/PerfdataListView",
        "views/WizardView",
        "views/NGrapherTextareaView",
        "views/BoundPerfdataHighlighterView",
        "utils/PerfdataParser"], function(SliderView, Perfdatas, PerfdataListView, WizardView, NGrapherTextareaView, BoundPerfdataHighlighterView, PerfdataParser) {
	
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
		wizardView = new WizardView(),
		boundPerfdataHighlighterView;
	
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
			
			boundPerfdataHighlighterView = new BoundPerfdataHighlighterView({
				perfdata: perfdata,
				tokens: tokens			
			});
			
			boundPerfdataHighlighterView.on("hover", function(state, regex){
				console.debug("hover-value ", state, regex);
				
				pdw.highlightByIndex(regex, state);
			});
			
			perfdatas.on("view:hover", function(hovered, regex, color){
				console.debug("hover item ", hovered, regex, color);
				
				boundPerfdataHighlighterView.highlightByRegEx(regex, color);
			});
			
			$("#perfdata-header").html("").append(boundPerfdataHighlighterView.render().$el);
			
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
