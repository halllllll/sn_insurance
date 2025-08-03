package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {

	m.Register(func(app core.App) error {
		// serial_numbersコレクションのserial_numberフィールドにインデックスを作成
		// _, err := app.DB().NewQuery(`
		// 	CREATE INDEX IF NOT EXISTS idx_serial_numbers_serial_number
		// 	ON serial_numbers (serial_number);
		// `).Execute()

		// return err
		collection, err := app.FindCollectionByNameOrId("serial_numbers")
		if err != nil {
			return err
		}
		collection.AddIndex("idx_serial_numbers_sn", true, "serial_number", "")

		// validate and persist
		// (use SaveNoValidate to skip fields validation)
		return app.Save(collection)
	}, func(app core.App) error {
		// インデックスを削除（ロールバック用）
		collection, err := app.FindCollectionByNameOrId("serial_numbers")
		if err != nil {
			return err
		}
		// _, err := app.DB().NewQuery(`
		// 	DROP INDEX IF EXISTS idx_serial_numbers_serial_number;
		// `).Execute()

		// return err

		collection.RemoveIndex("idx_serial_numbers_sn")
		return app.Save(collection)
	})
}
