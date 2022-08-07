(function() {
  var floatingLabel;

  floatingLabel = class floatingLabel {
    constructor(form, options = {}) {
      var event, i, input, j, label, len, len1, ref, ref1;
      if (!form) {
        return;
      }
      options.focusClass || (options.focusClass = "focus");
      options.activeClass || (options.activeClass = "active");
      options.errorClass || (options.errorClass = "error");
      form.classList.add('has-floated-label');
      ref = form.querySelectorAll('label');
      for (i = 0, len = ref.length; i < len; i++) {
        label = ref[i];
        if (!(input = document.querySelector(`#${label.getAttribute('for')}`))) {
          return;
        }
        ref1 = ['keyup', 'input', 'change'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          event = ref1[j];
          input.addEventListener(event, function() {
            this.parentNode.classList.remove(options.errorClass);
            return this.parentNode.classList.toggle(options.activeClass, !!this.value);
          });
        }
        input.addEventListener('focus', function() {
          return this.parentNode.classList.add(options.focusClass);
        });
        input.addEventListener('blur', function() {
          return this.parentNode.classList.remove(options.focusClass);
        });
        input.parentNode.classList.toggle(options.activeClass, !!input.value);
      }
    }

  };

  // initialize
  window.floatingLabel = new floatingLabel(document.querySelector('.form'));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLGdCQUFOLE1BQUEsY0FBQTtJQUVFLFdBQWEsQ0FBQyxJQUFELEVBQU0sVUFBUSxDQUFBLENBQWQsQ0FBQTtBQUVmLFVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQTtNQUFJLEtBQWMsSUFBZDtBQUFBLGVBQUE7O01BRUEsT0FBTyxDQUFDLGVBQVIsT0FBTyxDQUFDLGFBQWU7TUFDdkIsT0FBTyxDQUFDLGdCQUFSLE9BQU8sQ0FBQyxjQUFnQjtNQUN4QixPQUFPLENBQUMsZUFBUixPQUFPLENBQUMsYUFBZTtNQUV2QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsbUJBQW5CO0FBRUE7TUFBQSxLQUFBLHFDQUFBOztRQUNFLEtBQWMsQ0FBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsQ0FBQSxDQUFBLENBQUEsQ0FBSSxLQUFLLENBQUMsWUFBTixDQUFtQixLQUFuQixDQUFKLENBQUEsQ0FBdkIsQ0FBUixDQUFkO0FBQUEsaUJBQUE7O0FBRUE7UUFBQSxLQUFBLHdDQUFBOztVQUNFLEtBQUssQ0FBQyxnQkFBTixDQUF1QixLQUF2QixFQUE4QixRQUFBLENBQUEsQ0FBQTtZQUM1QixJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUF0QixDQUE2QixPQUFPLENBQUMsVUFBckM7bUJBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBdEIsQ0FBNkIsT0FBTyxDQUFDLFdBQXJDLEVBQWtELENBQUMsQ0FBQyxJQUFDLENBQUEsS0FBckQ7VUFGNEIsQ0FBOUI7UUFERjtRQUlBLEtBQUssQ0FBQyxnQkFBTixDQUF1QixPQUF2QixFQUFnQyxRQUFBLENBQUEsQ0FBQTtpQkFDOUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBdEIsQ0FBMEIsT0FBTyxDQUFDLFVBQWxDO1FBRDhCLENBQWhDO1FBRUEsS0FBSyxDQUFDLGdCQUFOLENBQXVCLE1BQXZCLEVBQStCLFFBQUEsQ0FBQSxDQUFBO2lCQUM3QixJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUF0QixDQUE2QixPQUFPLENBQUMsVUFBckM7UUFENkIsQ0FBL0I7UUFFQSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUEzQixDQUFrQyxPQUFPLENBQUMsV0FBMUMsRUFBdUQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUEvRDtNQVhGO0lBVlc7O0VBRmYsRUFBQTs7O0VBMkJBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLElBQUksYUFBSixDQUFrQixRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUFsQjtBQTNCdkIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBmbG9hdGluZ0xhYmVsXG4gIFxuICBjb25zdHJ1Y3RvcjogKGZvcm0sb3B0aW9ucz17fSkgLT5cbiAgICBcbiAgICByZXR1cm4gdW5sZXNzIGZvcm1cbiAgICBcbiAgICBvcHRpb25zLmZvY3VzQ2xhc3MgfHw9IFwiZm9jdXNcIlxuICAgIG9wdGlvbnMuYWN0aXZlQ2xhc3MgfHw9IFwiYWN0aXZlXCJcbiAgICBvcHRpb25zLmVycm9yQ2xhc3MgfHw9IFwiZXJyb3JcIlxuICAgIFxuICAgIGZvcm0uY2xhc3NMaXN0LmFkZCAnaGFzLWZsb2F0ZWQtbGFiZWwnXG4gICAgXG4gICAgZm9yIGxhYmVsIGluIGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnbGFiZWwnKVxuICAgICAgcmV0dXJuIHVubGVzcyBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjI3tsYWJlbC5nZXRBdHRyaWJ1dGUoJ2ZvcicpfVwiKVxuICAgICAgICAgICAgICAgICAgXG4gICAgICBmb3IgZXZlbnQgaW4gWydrZXl1cCcsJ2lucHV0JywgJ2NoYW5nZSddXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgZXZlbnQsIC0+XG4gICAgICAgICAgQHBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSBvcHRpb25zLmVycm9yQ2xhc3NcbiAgICAgICAgICBAcGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlIG9wdGlvbnMuYWN0aXZlQ2xhc3MsICEhQHZhbHVlXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyICdmb2N1cycsIC0+XG4gICAgICAgIEBwYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQgb3B0aW9ucy5mb2N1c0NsYXNzXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyICdibHVyJywgLT5cbiAgICAgICAgQHBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSBvcHRpb25zLmZvY3VzQ2xhc3NcbiAgICAgIGlucHV0LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSBvcHRpb25zLmFjdGl2ZUNsYXNzLCAhIWlucHV0LnZhbHVlXG5cbiMgaW5pdGlhbGl6ZVxuICAgIFxud2luZG93LmZsb2F0aW5nTGFiZWwgPSBuZXcgZmxvYXRpbmdMYWJlbCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpIl19
//# sourceURL=coffeescript