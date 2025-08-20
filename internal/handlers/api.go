package handlers

import (
	"net/http"

	"github.com/pocketbase/pocketbase/core"
)

// RegisterAPIRoutes registers all API routes
func RegisterAPIRoutes(e *core.ServeEvent) {
	e.Router.GET("/hello", handleHello)
}

// handleHello handles the hello endpoint
func handleHello(e *core.RequestEvent) error {
	return e.JSON(http.StatusOK, map[string]string{
		"message": "hello",
	})
}
