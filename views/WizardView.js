
define(["../utils/PerfdataParser", "../views/PerfdataHighlighterView"], function(PerfdataParser, PerfdataHighlighterView) {

	return Backbone.View.extend({
		el: "#perfdata-wiz",
		
		events: {
			"submit form": "onSubmit"
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
				this.$btn.text("Build manually");
				this.$resultText.text("Unable to detect any values within this perfdata");
				this.$data.html("");
			} else {
				this.$btn.text("Use it to build the config");
				this.$resultText.text("Great, we've detected Perfdata with " + matchers.length + " values");
				
				this.$data.html(
					new PerfdataHighlighterView({
						perfdata: perf,
						tokens: tokens
					}).render().$el
				);
			}
							
			return false;
		}
		
		
	
	});
	
});
