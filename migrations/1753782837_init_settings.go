package migrations

import (
	"fmt"
	"learning-pb-easy/config"
	"log"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		// 各種スキーマ初期設定
		// - users collectionのスキーマはデフォルト
		// - users collectionsにOAuth2の設定を追加
		// - serial_numbers collectionをbase collectionで追加
		// - serial_numbers collectionにフィールドを追加
		//   - serial_number (string, required)
		//   - is_assuarance (bool, default: false)
		// - serial_numbers collectionにインデックスを追加

		cfg := config.LoadConfig()

		userCollection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			fmt.Println("👺👺👺👺 ユーザコレクションの取得に失敗！", "error: ", err)
			log.Fatal(err)
		}

		if userCollection == nil {
			fmt.Println("👺👺👺👺 ユーザコレクションが見つからない！")
			fmt.Println("ユーザコレクションが見つからないため、アプリケーションを終了します。")
			log.Fatal(err)
		}

		userCollection.OAuth2.Enabled = true
		userCollection.OAuth2.Providers = []core.OAuth2ProviderConfig{
			{
				Name:         "google",
				ClientId:     cfg.AppInfo.ClientID,
				ClientSecret: cfg.AppInfo.ClientSecret,
			},
		}

		// auth collectionのデフォルトのapi ruleに任せる
		// userCollection.ListRule = types.Pointer(`id = @request.auth.id`)
		// userCollection.ViewRule = types.Pointer(`id = @request.auth.id`)
		// userCollection.CreateRule = types.Pointer(``)
		// userCollection.UpdateRule = types.Pointer(`id = @request.auth.id`)
		// userCollection.DeleteRule = types.Pointer(`id = @request.auth.id`)

		if err := app.Save(userCollection); err != nil {
			fmt.Println("👺👺👺👺 ユーザコレクションの保存に失敗！", "error: ", err)
			log.Fatal(err)
		}

		fmt.Println("🐰 ユーザーコレクションの保存に成功")

		// serial_numbers コレクションのスキーマを定義

		snCollection, _ := app.FindCollectionByNameOrId("serial_numbers")
		if snCollection == nil {
			// 作成
			snCollection = core.NewBaseCollection("serial_numbers")
		}
		// スキーマ
		snCollection.Type = core.CollectionTypeBase
		snCollection.Fields.Add(&core.TextField{
			Name:     "serial_number",
			Required: true,
		})
		snCollection.Fields.Add(&core.BoolField{
			Name: "is_assuarance",
		})

		snCollection.Fields.Add(&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		})

		snCollection.Fields.Add(&core.AutodateField{
			Name:     "updated",
			OnUpdate: true,
		})

		// rule 認証済ユーザーのみアクセス可能
		snCollection.ListRule = types.Pointer(`@request.auth.id != ""`)
		// あとはそもそも不要

		return app.Save(snCollection)
	}, func(app core.App) error {
		// add down queries...
		snCollection, err := app.FindCollectionByNameOrId("serial_numbers")
		if err != nil {
			return err
		}
		if snCollection == nil {
			fmt.Println("👺👺👺👺 ユーザコレクションが見つからない！")
			log.Fatal("👺👺👺👺 ユーザコレクションが見つからない！")
			return nil
		}

		return app.Delete(snCollection)
	}, "1753782837_init_settings.go")
}
