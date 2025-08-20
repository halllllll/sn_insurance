package main

import (
	"log"
	"sn-insurance/internal/app"
)

func main() {
	application := app.New()
	if err := application.Start(); err != nil {
		log.Fatal(err)
	}
}
