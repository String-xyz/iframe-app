package src

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

// Embded the build and static files from js and templates
//go:embed public/*
var BuildFs embed.FS

func BuildHTTPFS() http.FileSystem {
	public, err := fs.Sub(BuildFs, "public")
	if err != nil {
		log.Fatal(err)
	}
	return http.FS(public)
}
