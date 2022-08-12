package api

import (
	"html/template"
	"io/fs"
	"net/http"
	"os"

	"github.com/String-xyz/iframe-app/src"
	"github.com/labstack/echo"
)

func Start() {
	e := echo.New()
	templDir := os.Getenv("TEMPLATE_DIR")
	port := os.Getenv("PORT")
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseFS(src.BuildFs, templDir)),
	}
	e.Renderer = renderer
	registerRoutes(e)
	e.Logger.Fatal(e.Start(":" + port))
}

func registerRoutes(e *echo.Echo) {
	useOS := len(os.Args) > 1 && os.Args[1] == "live"
	assetHandler := http.FileServer(getFileSystem(useOS))
	e.GET("/static/*", echo.WrapHandler(http.StripPrefix("/static/", assetHandler)))
	e.GET("/", index)
	e.GET("/platform", plaform)
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, "healthy")
	})

	registerTransact(e)
}

// ** Handle internal transaction endpoints
func registerTransact(e *echo.Echo) {
	e.POST("/transact", transact)
}

// ** Read files from dir or embeded when compiled
func getFileSystem(useOS bool) http.FileSystem {
	if useOS {
		return http.FS(os.DirFS(os.Getenv("PUBLIC_DIR")))
	}
	fsys, err := fs.Sub(src.BuildFs, "public/build")
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}
