package api

import (
	"net/http"

	"github.com/labstack/echo"
)

func index(c echo.Context) error {

	return c.Render(http.StatusOK, "root.html", map[string]interface{}{
		"name": "Dolly!",
	})
}

func transact(c echo.Context) error {
	return nil
}

func plaform(c echo.Context) error {
	return nil
}
