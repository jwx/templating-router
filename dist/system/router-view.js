System.register(["aurelia-dependency-injection", "aurelia-templating", "aurelia-router", "aurelia-metadata"], function (_export) {
  "use strict";

  var Container, CustomElement, ViewSlot, ViewStrategy, UseView, NoView, Router, Origin, RouterView;
  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTemplating) {
      CustomElement = _aureliaTemplating.CustomElement;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewStrategy = _aureliaTemplating.ViewStrategy;
      UseView = _aureliaTemplating.UseView;
      NoView = _aureliaTemplating.NoView;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }],
    execute: function () {
      RouterView = function RouterView(element, container, viewSlot, router) {
        this.element = element;
        this.container = container;
        this.viewSlot = viewSlot;
        this.router = router;
        router.registerViewPort(this, element.getAttribute("name"));
      };

      RouterView.annotations = function () {
        return [new CustomElement("router-view"), new NoView()];
      };

      RouterView.inject = function () {
        return [Element, Container, ViewSlot, Router];
      };

      RouterView.prototype.process = function (viewPortInstruction, waitToSwap) {
        var _this = this;
        var component = viewPortInstruction.component, viewStrategy = component.view, viewModelInfo = component.viewModelInfo, childContainer = component.childContainer, viewModel = component.executionContext;

        if (!viewStrategy && "getViewStrategy" in viewModel) {
          viewStrategy = viewModel.getViewStrategy();
        }

        if (viewStrategy) {
          viewStrategy = ViewStrategy.normalize(viewStrategy);
          viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
        }

        return viewModelInfo.type.load(childContainer, viewModelInfo.value, viewStrategy).then(function (behaviorType) {
          viewPortInstruction.behavior = behaviorType.create(childContainer, { executionContext: viewModel });

          if (waitToSwap) {
            return;
          }

          _this.swap(viewPortInstruction);
        });
      };

      RouterView.prototype.swap = function (viewPortInstruction) {
        this.viewSlot.swap(viewPortInstruction.behavior.view);

        if (this.view) {
          this.view.unbind();
        }

        this.view = viewPortInstruction.behavior.view;
      };

      _export("RouterView", RouterView);
    }
  };
});