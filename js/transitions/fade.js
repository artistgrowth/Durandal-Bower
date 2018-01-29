define(["jquery", "lodash", "durandal/system", "durandal/composition", "services/log"], function($, _, system, composition, Log) {
    var log = Log.getLogger(this),
        defaults = {
            animateHeight: true,
            fadeOutDuration: 100,
            fadeInDuration: 100,
            forceInitialFadeIn: false
        };

    var transition = function(context) {
        return system.defer(function(deferred) {
            var fadeOutDuration = context.fadeOutDuration || defaults.fadeOutDuration,
                fadeInDuration = context.fadeInDuration || defaults.fadeInDuration,
                animateHeight = _.isBoolean(context.animateHeight) ? context.animateHeight : defaults.animateHeight,
                forceInitialFadeIn = !!context.forceInitialFadeIn || defaults.forceInitialFadeIn,
                $child = $(context.child),
                parentHeight = $(context.parent).height(),
                targetHeight = $child.height(),
                shouldFadeOut = !!context.activeView,
                initialStyles = {
                    display: "block",
                    opacity: 0
                };

            if (!context.child) {
                $(context.activeView).fadeOut(fadeOutDuration, endTransition);
                return;
            }

            if (animateHeight) {
                initialStyles.height = parentHeight || "auto";
            }

            if (shouldFadeOut) {
                var $active = $(context.activeView),
                    $parent = $(context.parent);

                $active.animate({ opacity: 0 }, {
                    duration: fadeOutDuration,
                    always: function() {
                        $parent.css("min-height", $active.height());
                        $active.css({
                            display: "none",
                            opacity: ""
                        });

                        $child.css(initialStyles);
                        $parent.css("min-height", "");

                        startTransition();
                    }
                });
            } else {
                $child.css(initialStyles);
                startTransition();
            }

            function startTransition() {
                context.triggerAttach();

                if (parentHeight === 0 && !forceInitialFadeIn) {
                    // This is a new view, so don't bother animating it in.
                    $child.css("opacity", 1);
                    endTransition();
                } else {
                    var targetStyles = { opacity: 1 },
                        resetStyles = { opacity: "" };
                    if (animateHeight) {
                        targetStyles.height = targetHeight;
                        resetStyles.height = "auto";
                    }

                    $child.animate(targetStyles, {
                        duration: fadeInDuration,
                        always: function() {
                            $child.css(resetStyles);
                            endTransition();
                        }
                    });
                }
            }

            function endTransition() {
                deferred.resolve();
            }
        }).promise();
    };

    return transition;
});
