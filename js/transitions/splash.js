define(["jquery", "lodash", "durandal/system", "durandal/composition", "services/log"], function($, _, system, composition, Log) {
    var log = Log.getLogger(this);

    var transition = function(context) {
        return system.defer(function(deferred) {
            var fadeOutDuration = 250,
                shouldFadeOut = !!context.activeView,
                initialStyles = {
                    display: "block",
                    opacity: 0
                };

            if (!context.child) {
                if (shouldFadeOut) {
                    $(context.activeView).fadeOut(fadeOutDuration, endTransition);
                }
                return;
            }

            if (shouldFadeOut) {
                var $active = $(context.activeView),
                    $clone = $active.clone(),
                    $parent = $(context.parent);

                $("body").append($clone);
                $active.remove();

                context.triggerAttach();
                deferred.resolve();

                $clone.animate({ opacity: 0 }, {
                    duration: fadeOutDuration,
                    always: function() {
                        $clone.remove();
                    }
                });
            } else {
                deferred.resolve();
            }
        }).promise();
    };

    return transition;
});
