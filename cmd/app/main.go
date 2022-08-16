package main

import (
	"github.com/String-xyz/iframe-app/api"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load("./../../.env")
	api.Start()
}
