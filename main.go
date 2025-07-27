package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	app := pocketbase.New()

	migratecmd.Register(app, app.RootCmd, migratecmd.Config{
		Automigrate: false,
	})

	// 適当なAPIを登録
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		e.Router.GET("/hello", func(e *core.RequestEvent) error {
			return e.JSON(http.StatusOK, map[string]string{
				"message": "hello",
			})
		})
		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
