# CHANGELOG

## v0.3.1 (December 4, 2014)

- Fix scrolling when popover is positioned off screen.

## v0.3.0 (November 18, 2014)

- BREAKING: Move attach property to rs-popover-trigger.
- BREAKING: Move functionality from focus service into form service.
- BREAKING: Change argument order for form service methods to be consistent.
- BREAKING: Change method signature when controlling popovers programmatically.
- Allow popover targets to be specified by ID.
- Allow custom data to be passed into popover hooks.
- Prevent popover from being dismissed while saving.
- Stop trying to reset validation state on popovers without forms.
- Show processing indicator when saving.
- Upgrade Angular dependency to ~1.3.0.

## v0.2.4 (October 18, 2014)

- Show error message when on-save hook is rejected.

## v0.2.3 (October 14, 2014)

- Fix validation when used in conjunction with blur-triggered binding.
- Fix loading in browsers that require a vendor prefix on the CSS transform property.

## v0.2.2 (September 25, 2014)

- Revert to using $dirty to trigger validation.
- Update development dependencies.

## v0.2.1 (September 24, 2014)

- BREAKING: rs-popover-form now requires Angular 1.3.
- Use $touched to trigger validation instead of $dirty.
- Reset validation every time the popover is closed.

## v0.2.0 (September 22, 2014)

- Add support "top-left" attachment point.
- Fix bug where popover overlay did not scroll with page.

## v0.1.4 (August 11, 2014)

- Focus the first input on subsequent popover loads.

## v0.1.3 (August 11, 2014)

- Focus the first input when popover form loads.

## v0.1.2 (August 1, 2014)

- Remove popovers from registry when their scope is destroyed.

## v0.1.1 (July 31, 2014)

- Fix CSS for popover so the bottom border is not transparent.
- Fix bug where rs-popover-form threw errors when labels were not specified.

## v0.1.0 (July 31, 2014)

- Initial release of rs-popover directive.
- Initial release of rs-popover-form directive.
- Initial release of rs-popover-trigger directive.
