package api

import (
	"net/http"

	"github.com/labstack/echo"
)

func index(c echo.Context) error {
	return c.Render(http.StatusOK, "main.html", map[string]interface{}{
		"name": "Root",
	})
}

func transact(c echo.Context) error {
	return nil
}

func plaform(c echo.Context) error {

	return c.Render(http.StatusOK, "platform.html", map[string]interface{}{
		"name": "Platform",
	})
}
