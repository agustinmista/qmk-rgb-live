{
  description = "QMK RGB Live Development Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Derivation built using PNPM
        qmk-rgb-live = pkgs.stdenv.mkDerivation (final: {
          pname = "qmk-rgb-live";
          version = "0.1.0";
          src =
            with pkgs.lib.fileset;
            toSource {
              root = ./.;
              fileset = gitTracked ./.;
            };
          nativeBuildInputs = [
            pkgs.nodejs
            pkgs.pnpm
            pkgs.pnpm.configHook
          ];
          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (final) pname version src;
            fetcherVersion = 3;
            hash = "sha256-/UazN9G94y7SN4bQ/AZaaZ4b+1WWQ7uTXIZuEeGL1fc=";
          };
          buildPhase = ''
            runHook preBuild
            pnpm run lint
            pnpm build
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/* $out
            runHook postInstall
          '';
        });
      in
      {
        # Development shell
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.pnpm
            pkgs.nodejs
          ];
        };
        # Default package
        packages.default = qmk-rgb-live;
      }
    );
}
