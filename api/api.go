package api

import (
	"html/template"

	"github.com/labstack/echo"
)

func Start() {
	e := echo.New()
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("./../templates/*.html")), //TODO: move templates to root dir.
	}
	e.Renderer = renderer
	e.Static("/public", "./../public")
	e.GET("/", index)
	e.POST("/transact", transact)
	e.GET("/platform", plaform)
	e.Logger.Fatal(e.Start(":8080"))
}
