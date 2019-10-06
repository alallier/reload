# How to contribute to Reload

## Before opening a pull request

- Be sure all tests pass: `npm t`.
- Ensure code coverage does not decrease and write new tests if necessary: `npm run coverage`.

## Release process

If you are a maintainer of Reload, please follow the following release procedure:

- Merge all desired pull requests into master.
- Bump `package.json` to a new version and run `npm i` to generate a new `package-lock.json`.
- Bump sample app's reload version to match new bumped version.
- Make any final edits to CHANGELOG.
- Paste contents of CHANGELOG for the new version into new version commit.
- Open and merge a pull request with those changes.
- Tag the merge commit as the a new release version number.
- Publish commit to npm.
