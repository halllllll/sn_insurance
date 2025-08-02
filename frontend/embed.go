package frontend

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var distDir embed.FS

// DistDirFS は、埋め込まれた `dist` ディレクトリのファイル群を指す
var DistDirFS, _ = fs.Sub(distDir, "dist")
