define([], function() {

	return Backbone.View.extend({
		className : "tooltip",

		template : _.template('<div></div><span class="tip"></span>'),

		initialize : function() {
			var self = this, $el = this.$el;

			$el.append($(this.template()));

			this.$body = $el.children("div");

			$el.addClass(this.cls || "");

			// defer click handler registration as the constructor might be 
			// invoked by the same click 
			setTimeout(function(){
				$("body").append($el).on("click.hide-tooltip", function(evt){
					self.onDocumentBodyClick.call(self, evt);
				});				
			});
		},
		
		onDocumentBodyClick: function(evt){
			var target = $(evt.target);
			
			// monitoring click on document
			
			// try to find tooltip element by walking upward
			if (target.parents(".tooltip").length) {
				// ignore/allow click on the tooltip's body (and below)
				return;
			}
			
			// the click happened outside the tooltip
			
			this.hide();
		},

		_alignTo : function(by) {
			var $el = this.$el,
				offs = by.offset(),
				w = by.outerWidth(),
				h = by.height(),
				x = offs.left + (w / 2) - 18,
				y = offs.top + h + 1 + 13;

			$el.css({left : x, top : y});
		},

		show : function(cfg) {
			this.$el.show();

			if (cfg.by) {
				this._alignTo($(cfg.by));
			}
			
			this.on("hide", function(){
				if (_.isFunction(cfg.onHide)) {
					cfg.onHide(cfg.by);
				}
			});

			return this;
		},

		hide : function() {
			this.$el.hide();
			this.trigger("hide");
			
			$("body").off("click.hide-tooltip");
			
			this.onRemove();
			this.remove();
			
			return this;
		},
		
		onRemove: function(){
			
		}

	});

});
