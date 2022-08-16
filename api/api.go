package api

import (
	"html/template"
	"net/http"
	"os"

	"github.com/String-xyz/iframe-app/src"
	"github.com/labstack/echo"
)

const templateDir = "public/templates/*.html"

func Start() {
	e := echo.New()
	port := os.Getenv("PORT")
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseFS(src.BuildFs, templateDir)),
	}
	e.Renderer = renderer
	registerRoutes(e)
	e.Logger.Fatal(e.Start(":" + port))
}

func registerRoutes(e *echo.Echo) {
	useOS := len(os.Args) > 1 && os.Args[1] == "live"
	assetHandler := http.FileServer(src.GetFileSystem(useOS))

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
	e.POST("/quote", quote)
}
