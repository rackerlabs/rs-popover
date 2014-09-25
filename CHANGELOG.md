# CHANGELOG

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
