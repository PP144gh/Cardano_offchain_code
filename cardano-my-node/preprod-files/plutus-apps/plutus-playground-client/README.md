The Plutus Playground is an online IDE that enables users to easily write and
simulate Plutus Applications.

## Getting started

The Plutus Playground is written in [PureScript](https://www.purescript.org/) and uses npm and [spago](https://github.com/purescript/spago) for managing dependencies. It talks to the [plutus-playground-server](https://github.com/input-output-hk/plutus-apps/tree/master/plutus-playground-server) which also needs to be up and running during development. The client build also depends on purescript files that are generated by the backend service using [purescript-bridge](https://github.com/eskimor/purescript-bridge).

**Note**: _The workflow described here relies heavily on Nix. This means you should either be working inside a nix-shell environment or use tools such as [lorri](https://github.com/target/lorri) or [nix-direnv](https://github.com/nix-community/nix-direnv) or similar to provide a suitable environment._

### Starting the backend server

```bash
$ plutus-playground-server
```

The `plutus-playground-server` script is provided by the global [shell.nix](../shell.nix) and starts the server (If the command
is not available make sure you are in a nix-shell session or that lorri is ready). For additional information on invoking the backend server please refer to its [README.md](https://github.com/input-output-hk/plutus-apps/tree/main/plutus-playground-server).

### Starting the frontend server

With the backend server running you can get started using the `npm start` script:

```bash
$ npm run start
```

The `start` script will:

- Install npm dependencies
- Generate purescript bridge code
- Compile the purescript code
- Start the webkpack server

Once the `start` script completes you can access the frontend via [https://localhost:8009](https://localhost:8009)

> **Note**: You may need to adjust `webpack.config.js` to serve non-SSL content; set
> `module.exports.devServer.https` to `false`.

## Development Workflow

The following outlines some essentials for actually working on the plutus playground code.

### NPM Scripts

Apart from the `start` script introduced above there are a couple of scripts for the most frequent tasks during development. In order to run a webpack server in development mode with automatic reloading use **webpack:server**:

```
$ npm run build:webpack:dev
```

Please refer to [package.json](./package.json) for the full set of provided scripts.

### Generating PureScript Code

The PureScript build depends on the presence of a `./generated` folder with bridge code generated by the backend. This code can
be generated by running `plutus-playground-generate-purs` which is provided by the nix-shell environment.

### Managing Dependencies

There are two relevant sources of dependencies that have to be handled and integrated with Nix separately: _Javascript(/npm)_ dependencies and _PureScript_ dependencies.

#### Managing NPM Dependencies

The Javascript dependencies are handled by npm in [package.json](./package.json) (and [package-lock.json](./package-lock.json) which
is updated by npm automatically).

The npm dependencies are integrated with Nix via [npmlock2nix](https://github.com/tweag/npmlock2nix) almost completely transparently. Any changes to the lockfile will be picked up npmlock2nix automatically during the nix build. No
additional files have to be generated or maintained.

##### NodeJS GitHub dependencies

In general, npm dependencies are handled by npmlock2nix automatically and transparently. The one exception to this rule are
GitHub dependencies. In order for these to work in restricted evaluation mode (which is what hydra uses) you have to specify
the sha256 of the dependency you want to use in your `buildNodeModules`. For example:

```
buildNodeModules {
    projectDir = ./.;
    packageJson = ./package.json;
    packageLockJson = ./package-lock.json;
    githubSourceHashMap = {
      shmish111.nearley-webpack-loader."939360f9d1bafa9019b6ff8739495c6c9101c4a1" = "1brx669dgsryakf7my00m25xdv7a02snbwzhzgc9ylmys4p8c10x";
    };
}
```

You can add new dependencies with the sha256 set to `"0000000000000000000000000000000000000000000000000000"`. This will yield an error
message during the build with the actual hash value.

#### Managing PureScript Dependencies

The PureScript dependencies are handled by [spago](https://github.com/purescript/spago) in [packages.dhall](./packages.dhall).

The Nix integration is done using [spago2nix](https://github.com/justinwoo/spago2nix). Any changes to the PureScript dependencies
require an update of the Nix code generated by spago2nix:

```
$ spago2nix generate
```

This will parse the spago configuration and will generate an updated `.nix` file.

**Note**: If the `spago2nix` command is not available make sure you are inside a nix-shell environment or that your lorri session
is up and running.


### Nix

#### Building The Client With Nix

You can run the following command (from the repository root) to build the client and the
backend server with Nix:

```sh
$ nix-build -A plutus-playground.client -A plutus-playground.server
```