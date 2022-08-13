package src

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
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

//GetFileSystem Read files from dir or embeded when compiled
func GetFileSystem(useOS bool) http.FileSystem {
	if useOS {
		return http.FS(os.DirFS(os.Getenv("PUBLIC_DIR")))
	}
	fsys, err := fs.Sub(BuildFs, "public/build")
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}
