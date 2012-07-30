
/** Wrap PerfdataList and Highlighter to hide both views behind one view and 
 * to encapsulate the cross highlighting logic.
 */
define(["views/PerfdataListView",
        "views/BoundPerfdataHighlighterView",
        "utils/PerfdataParser"], function(PerfdataListView, BoundPerfdataHighlighterView, PerfdataParser){
	
	return Backbone.View.extend({
		el: $("#perfdata-box"),
		
		initialize: function(){
			var $el = this.$el;
			
			this.list = new PerfdataListView({collection: this.collection});
			
			this.collection.on("view:hover", function(hovered, regex, color){
				this.highlighter.highlightByRegEx(regex, color);
			}, this);
			
			this.$list = $el.children("#perfdata-list");
			this.$header = $el.children("#perfdata-header")
		},
		
		render: function(){
			var $el = this.$el,
				$list = this.$list;
			
			$list.append(this.list.render().$el);
			
			this.collection.on("add", function(){
				$el.scrollTop(
					$list.outerHeight()
				);
			});			
			
			return this;
		},
		
		_attachNewHighlighter: function(perfdata, tokens){
			var $el = this.$el,
				$header = this.$header;
			
			if (this.highlighter) {
				// remove already rendered element
				this.highlighter.remove();
			}
			
			this.highlighter = new BoundPerfdataHighlighterView({
				perfdata: perfdata,
				tokens: tokens			
			});
			
			this.highlighter.on("hover", function(state, regex){
				this.list.highlightByIndex(regex, state);
			}, this);
			
			$header.append(this.highlighter.render().$el);
		},
		
		show: function(perfdata){
			var tokens, matchers, variables;
			
			tokens = PerfdataParser.getTokened(perfdata);
			matchers = PerfdataParser.getMatchers(tokens);
			variables = PerfdataParser.getVariables(tokens);
			
			this._attachNewHighlighter(perfdata, tokens);
		}
		
	});
	
	
});
