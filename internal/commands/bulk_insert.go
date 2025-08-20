package commands

import (
	"fmt"
	"sn-insurance/internal/services"

	"github.com/pocketbase/pocketbase"
	"github.com/spf13/cobra"
)

// RegisterBulkInsertCommand registers the bulk insert command
func RegisterBulkInsertCommand(app *pocketbase.PocketBase) {
	app.RootCmd.AddCommand(&cobra.Command{
		Use:   "bulk-insert-sn",
		Short: "Serial number bulk insert from command",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("🐰 バルクインサートコマンドを実行中...")

			service := services.NewSerialNumberService(app)
			if err := service.BulkInsertFromCSV(args[0]); err != nil {
				fmt.Printf("👺👺👺👺 バルクインサートエラー: %v\n", err)
				return
			}

			fmt.Println("🐰 バルクインサート完了！")
		},
	})
}
