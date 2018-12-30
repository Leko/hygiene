# hygiene

[![CircleCI](https://circleci.com/gh/Leko/hygiene.svg?style=svg)](https://circleci.com/gh/Leko/hygiene)
![](https://img.shields.io/npm/v/@hygiene/cli.svg)
![](https://img.shields.io/npm/dm/@hygiene/cli.svg)
![](https://img.shields.io/npm/l/@hygiene/cli.svg)

<img width="397" alt="screen shot 2018-12-31 at 00 24 57" src="https://user-images.githubusercontent.com/1424963/50548570-9a993080-0c92-11e9-866d-88e2b697bae0.png">

Keep your TODOs and FIXMEs healthy

## Supported languages

hygiene supports any languages not only JavaScript.
you can see a list of languages in here.

https://github.com/pgilad/leasot#supported-languages

## Install

```
npm install -g hygiene
```

Or you can use hygiene with `npx` without `npx install`.

```
npx hygiene
```

## Usage

```
$ npx hygiene --help
hygiene <command>

Commands:
  hygiene run [glob]

Global Options
  --json            Report as JSON                    [boolean] [default: false]
  --ignore-pattern  Pattern of files to ignore          [string] [default: null]
  --ignore-path     Specify path of ignore file
       [string] [default: "/Users/leko/.ghq/github.com/Leko/hygiene/.gitignore"]
  --ignore          Disable use of ignore files and patterns
                                                       [boolean] [default: true]

Plugin Options: github-url
  --repository  Specify current repository. ex. `owner/repo`
                                              [string] [default: "Leko/hygiene"]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Examples

Disable ignore feature

```
hygiene run --no-ignore
```

Parse non-prefixed issue(ex. #123) as Leko/hygiene

```
hygiene run --repository Leko/hygiene
```

Set GitHub access token to fetch issue or pull request

```
GITHUB_TOKEN=xxx hygiene run --no-ignore
```

## Contribution

1. Fork this repository
1. Write your code
1. Run tests
1. Create pull request to master branch

## Development

```
git clone git@github.com:Leko/hygiene.git
cd hygiene
npm i
npx lerna bootstrap
npm test
```

## License

This package under [MIT](https://opensource.org/licenses/MIT) license.
