package config

import (
	"bufio"
	"io"
	"log"
	"os"

	"github.com/goccy/go-yaml"
	"github.com/joho/godotenv"
)

type AppInfo struct {
	ClientID     string
	ClientSecret string
	Name         string
}

type Config struct {
	Backend struct {
		Port int    `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"backend"`
	Frontend struct {
		Port int    `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"frontend"`
}

type GlobalConfig struct {
	AppInfo *AppInfo
	Config  *Config
}

func LoadConfig() *GlobalConfig {
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

	file, err := os.Open("config.yaml")
	if err != nil {
		log.Fatalf("Failed to open config.yaml: %v", err)
	}
	r := bufio.NewReader(file)
	data, err := io.ReadAll(r)

	if err != nil {
		log.Fatalf("Failed to read config.yaml: %v", err)
	}

	var config Config
	if err = yaml.Unmarshal(data, &config); err != nil {
		log.Fatalf("Failed to parse config.yaml: %v", err)
	}

	var globalConfig GlobalConfig
	globalConfig.AppInfo = &appInfo
	globalConfig.Config = &config

	return &globalConfig
}
