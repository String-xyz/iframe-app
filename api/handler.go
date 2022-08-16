package api

import (
	"net/http"

	"github.com/String-xyz/iframe-app/model"
	"github.com/String-xyz/iframe-app/service"
	"github.com/labstack/echo"
)

func index(c echo.Context) error {
	return c.Render(http.StatusOK, "main.html", map[string]interface{}{
		"name": "Root",
	})
}

func transact(c echo.Context) error {
	body := &model.Transaction{}
	if err := c.Bind(body); err != nil {
		return err
	}
	resp, err := service.New().Transact(*body)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, resp)
}

func quote(c echo.Context) error {
	body := &model.Transaction{}
	if err := c.Bind(body); err != nil {
		return err
	}
	resp, err := service.New().Quote(*body)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, resp)
}

func plaform(c echo.Context) error {
	return c.Render(http.StatusOK, "platform.html", map[string]interface{}{
		"name": "Platform",
	})
}
