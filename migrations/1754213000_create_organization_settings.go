package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	core.SystemMigrations.Register(func(txApp core.App) error {
		collection := core.NewBaseCollection("organization_settings")

		// system fields are added automatically

		// add custom fields
		collection.Fields.Add(&core.TextField{
			Name:     "app_title",
			Required: false,
		})

		collection.Fields.Add(&core.TextField{
			Name:     "organization_name",
			Required: false,
		})

		collection.Fields.Add(&core.TextField{
			Name:     "contact_email",
			Required: false,
		})

		collection.Fields.Add(&core.TextField{
			Name:     "app_description",
			Required: false,
		})

		collection.Fields.Add(&core.BoolField{
			Name:     "maintenance_mode",
			Required: false,
		})

		collection.Fields.Add(&core.TextField{
			Name:     "maintenance_message",
			Required: false,
		})

		collection.ListRule = types.Pointer(`1=1`)

		return txApp.Save(collection)
	}, func(txApp core.App) error {
		collection, err := txApp.FindCollectionByNameOrId("organization_settings")
		if err != nil {
			return err
		}

		return txApp.Delete(collection)
	})
}
