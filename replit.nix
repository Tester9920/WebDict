{ pkgs }: {
	deps = [
   pkgs.lfs
   pkgs.git
   pkgs.unzip
   pkgs.openssh
   pkgs.iproute
   pkgs.inetutils
		pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
  pkgs.git-lfs
  pkgs.git-filter-repo
	];
}