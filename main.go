package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"learning-pb-easy/config"
	"log"
	"net/http"
	"os"
	"strings"

	_ "learning-pb-easy/migrations" // import migrations to register them

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/spf13/cobra"
)

func main() {
	appInfo := config.LoadAppInfo()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	app := pocketbase.NewWithConfig(pocketbase.Config{})

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate:  isGoRun,
		TemplateLang: "go",
	})

	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		app.Logger().Info("🐰 アプリケーションのブートストラップ中...")
		settings := app.Settings()
		if settings.Meta.AppName == "Acme" {
			settings.Meta.AppName = appInfo.Name
		}
		settings.Logs.MaxDays = 7
		settings.Logs.LogAuthId = true
		settings.Logs.LogIP = true
		// saveするとmigrate実行時にpanicで落ちた panic: runtime error: invalid memory address or nil pointer dereference
		// if err := app.Save(settings); err != nil {
		// 	log.Fatal(err)
		// }
		return e.Next()
	})

	// authコレクションであるusers collectionへのアクセス時のhook
	app.OnRecordAuthWithOAuth2Request().BindFunc(func(e *core.RecordAuthWithOAuth2RequestEvent) error {
		return e.Next()
	})

	app.RootCmd.AddCommand(&cobra.Command{
		Use:   "bulk-insert-sn",
		Short: "Serial number bulk insert from command",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("🐰 バルクインサートコマンドを実行中...")
			path := args[0]
			// f, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0644)
			f, err := os.Open(path)
			if err != nil {
				fmt.Println("👺👺👺👺 ファイル`"+path+"`のオープンに失敗！", "error: ", err)
				return
			}
			defer f.Close()

			csvReader := csv.NewReader(f)

			snCollection, _ := app.FindCollectionByNameOrId("serial_numbers")
			if snCollection == nil {
				fmt.Println("👺👺👺👺 シリアルナンバーコレクションが見つからない！")
				return
			}

			app.RunInTransaction(func(txApp core.App) error {
				fmt.Println("🐰 トランザクション内でのバルクインサートを開始...")
				// 引数で与えられたcsvファイルを読み取ってその内容をバルクインサートする

				for {
					csvRecord, err := csvReader.Read()
					if err == io.EOF {
						break
					}
					if err != nil {
						fmt.Println("👺👺👺👺 CSVファイルの読み取りに失敗！", "error: ", err)
						return err
					}
					if len(csvRecord) != 2 {
						fmt.Println("👺👺👺👺 CSVファイルのフォーマットが不正！各行は2つのフィールドを持つ必要があります。")
						return nil
					}
					fmt.Println(csvRecord)
					record := core.NewRecord(snCollection)
					record.Load(map[string]interface{}{
						"serial_number": csvRecord[0],
						"is_assuarance": csvRecord[1] == "true", // "true
					})

					if err := txApp.Save(record); err != nil {
						fmt.Println("👺👺👺👺 レコードの保存に失敗", "error: ", err)
						return err
					}
				}
				fmt.Println("🐰 トランザクション内でのバルクインサート完了！")

				return nil
			})

		},
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
