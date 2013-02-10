
define(["../utils/PerfdataParser", 
        "../views/PerfdataHighlighterView",
        "../views/Colors"], 
        function(PerfdataParser, PerfdataHighlighterView, Colors) {

	
	var DEFAULTS = {
			LEGEND: [
			         {"function": "AVERAGE", "description": "Avg: "},
			         {"function": "MIN", "description": "Min: "},
			         {"function": "MAX", "description": "Max: "},
			         {"function": "LAST", "description": "Last: ", active: true}
	        ]
	};
	
	return Backbone.View.extend({
		el: "#perfdata-wiz",
		
		events: {
			"submit form": "onSubmit",
			"click .footer-btn": "onClickContinue"
		},
				
		initialize: function(){
			var self = this, $el = this.$el;
			
			this.$wizBox = $el.find(".wiz-box");
			this.$input = $el.find("#example-perfdata");
			this.$resultText = $el.find("#perfdata-result-box .result-text");
			this.$data = $el.find("#perfdata-highlighter");
			this.$btn = $el.find(".footer-btn");
		},
		
		getPerfdata: function(){
			return this.$input.val();
		},
		
		onSubmit: function(){
			var perf = this.$input.val(), tokens, matchers;
			
			tokens = PerfdataParser.getTokened(perf);
			matchers = PerfdataParser.getMatchers(tokens);

			console.debug(tokens, matchers);
			
			if (!matchers.length) {
				this.$btn.hide()
				this.$resultText.text("Unable to detect any values within this perfdata");
				this.$data.html("");
			} else {
				this.$btn.show().text("Use it to build the config");
				this.$resultText.text("Great, we've detected Perfdata with " + matchers.length + " values");
				
				this.$data.html(
					new PerfdataHighlighterView({
						perfdata: perf,
						tokens: tokens
					}).render().$el
				);
			}
							
			return false;
		},
		
		
		onClickContinue: function(){
			var perfdata,
				tokens, matchers, variables,
				rawDatas = [],
				variable,
				matcher,
				i, colors = _.map(Colors, function(value, key){ return key; });
			
			perfdata = this.getPerfdata();
			
			tokens = PerfdataParser.getTokened(perfdata);
			matchers = PerfdataParser.getMatchers(tokens);
			variables = PerfdataParser.getVariables(tokens);
			
			for (i = 0; i < matchers.length; i++) {
				variable = variables[i];
				matcher = matchers[i];
	
				colors = _.shuffle(colors);
	
				rawDatas.push({
					variable: variable,
					regex: matcher,
					plot: {
						type: "line-2",
						color: "#" + colors.shift()
					},
					legends: DEFAULTS.LEGEND
				});
			}
			
			router.getListpage().show(perfdata);
			
			router.resetPerfdata(rawDatas);
		}
	
	});
	
});
