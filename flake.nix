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
        # Packages for this system
        pkgs = import nixpkgs { inherit system; };
      in
      {
        # Development shell
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.pnpm
            pkgs.nodejs
            pkgs.chromium
          ];
        };
      }
    );
}
