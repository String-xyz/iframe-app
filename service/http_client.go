package service

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

var BASE_URL = os.Getenv("BASE_URL")

const (
	POST = "POST"
	GET  = "GET"
)

func Get[T any](ctx context.Context, url string) (T, error) {
	var m T
	r, err := http.NewRequestWithContext(ctx, GET, url, nil)
	if err != nil {
		return m, err
	}

	res, err := http.DefaultClient.Do(r)
	if err != nil {
		return m, err
	}

	body, err := io.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return m, err
	}

	return parseJSON[T](body)
}

func Post[T any](ctx context.Context, url string, data any) (T, error) {
	var m T
	b, err := toJSON(data)
	if err != nil {
		return m, err
	}

	byteReader := bytes.NewReader(b)
	r, err := http.NewRequestWithContext(ctx, POST, url, byteReader)
	if err != nil {
		return m, err
	}

	r.Header.Add("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(r)
	if err != nil {
		return m, err
	}

	body, err := io.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return m, err
	}

	return parseJSON[T](body)
}

func parseJSON[T any](b []byte) (T, error) {
	var r T
	if err := json.Unmarshal(b, &r); err != nil {
		return r, err
	}
	return r, nil
}

func toJSON(T any) ([]byte, error) {
	return json.Marshal(T)
}
