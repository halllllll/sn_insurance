package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppInfo struct {
	ClientID     string
	ClientSecret string
	Name         string
}

func LoadAppInfo() *AppInfo {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	appInfo := AppInfo{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		Name:         "Serial Number DB",
	}

	if appInfo.ClientID == "" || appInfo.ClientSecret == "" {
		log.Fatal("CLIENT_ID and CLIENT_SECRET must be set in .env file")
	}

	return &appInfo
}
