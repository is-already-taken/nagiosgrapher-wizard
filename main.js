
define(["views/SliderView",
        "collections/Perfdatas",
        "views/PerfdataListView",
        "views/NGrapherTextareaView"], function(SliderView, Perfdatas, PerfdataListView, NGrapherTextareaView) {

	var perfdatas;
	
	perfdatas = new Perfdatas([{
		variable: "var1",
		regex: "/\d+,\d+,(\d+),\d+,\d+,\d+/",
		plot: {type: "area", color: "#90f"},
		legends: [
		          {"function": "AVERAGE", "description": "Avg: "},
			      {"function": "MIN", "description": "Min: "},
			      {"function": "MAX", "description": "Max: "},
			      {"function": "LAST", "description": "Last: ", active: true}
		]
	},{
		variable: "var2",
		regex: "/\d+,\d+,\d+,\d+,(\d+),\d+/",
		plot: {type: "line-2", color: "#09f"},
		legends: [
		          {"function": "AVERAGE", "description": "Avg: ", active: true},
			      {"function": "MIN", "description": "Min: "},
			      {"function": "MAX", "description": "Max: ", active: true},
			      {"function": "LAST", "description": "Last: ", active: true}
		]
	},{
		variable: "var3",
		regex: "/\d+,\d+,\d+,(\d+),\d+,\d+/",
		plot: {type: "line-2", color: "#f90"},
		legends: [
		          {"function": "AVERAGE", "description": "Avg: ", active: true},
			      {"function": "MIN", "description": "Min: "},
			      {"function": "MAX", "description": "Max: ", active: true},
			      {"function": "LAST", "description": "Last: ", active: true}
		]
	}], {parse: true});
	

	var pdw = new PerfdataListView({collection: perfdatas}),
		textarea = new NGrapherTextareaView({collection: perfdatas});
	
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
